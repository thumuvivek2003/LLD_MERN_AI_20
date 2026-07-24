import * as mailRepository from '../mail/mail.repository.js';
import { toMailDTOList } from '../mail/mail.mapper.js';
import { SearchContext } from '../../shared/strategy/search-context.js';
import { SEARCH_TYPES, isValidSearchType } from '../../shared/constants/search-types.constant.js';
import { tokenize } from '../../shared/utils/tokenizer.util.js';
import { AppError } from '../../shared/utils/app-error.util.js';

/**
 * Module-level SearchContext holding the default InvertedIndexStrategy.
 * The index subscriber calls indexMail() on every MAIL_SENT; buildIndex()
 * (re)builds it from the DB on startup.
 */
const searchContext = new SearchContext();

/** Combined searchable text for candidate generation (type=all). */
function combinedText(mail) {
  return getFieldText(mail, SEARCH_TYPES.ALL);
}

/** Extract the text relevant to a given search `type`. */
function getFieldText(mail, type) {
  const senderText = `${mail.sender?.name ?? ''} ${mail.sender?.email ?? ''}`;
  const receiverText = (mail.receivers || [])
    .map((r) => `${r?.name ?? ''} ${r?.email ?? ''}`)
    .join(' ');

  switch (type) {
    case SEARCH_TYPES.FROM:
      return senderText;
    case SEARCH_TYPES.TO:
      return receiverText;
    case SEARCH_TYPES.SUBJECT:
      return mail.subject ?? '';
    case SEARCH_TYPES.BODY:
      return mail.body ?? '';
    case SEARCH_TYPES.ALL:
    default:
      return `${mail.subject ?? ''} ${mail.body ?? ''} ${senderText} ${receiverText}`;
  }
}

/** Add / update a single mail in the inverted index. */
export function indexMail(mail) {
  if (!mail?._id) return;
  searchContext.addDocument(String(mail._id), combinedText(mail));
}

/** Remove a mail from the index. */
export function removeMail(mailId) {
  searchContext.removeDocument(String(mailId));
}

/** (Re)build the whole index from the database. Call once on startup. */
export async function buildIndex() {
  searchContext.clear();
  const mails = await mailRepository.findAll();
  for (const mail of mails) indexMail(mail);
  console.log(
    `[search] index built (${mails.length} mails, strategy=${searchContext.strategyName})`
  );
  return mails.length;
}

function participates(mail, userId) {
  const uid = String(userId);
  if (String(mail.sender?._id ?? mail.sender) === uid) return true;
  return (mail.receivers || []).some((r) => String(r?._id ?? r) === uid);
}

/**
 * Search mails for a user.
 * @param {string} userId
 * @param {string} query
 * @param {string} [type='all']
 * @returns {Promise<object[]>} MailDTOs (newest first) scoped to the user
 */
export async function search(userId, query, type = SEARCH_TYPES.ALL) {
  if (!userId) throw AppError.badRequest('userId is required', 'MISSING_USER_ID');
  const searchType = isValidSearchType(type) ? type : SEARCH_TYPES.ALL;

  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  // 1) Candidate mail ids from the inverted index (broad recall).
  const candidateIds = searchContext.executeSearch(query);
  if (candidateIds.length === 0) return [];

  // 2) Load candidates (populated) and apply precise, viewer + field filters.
  const mails = await mailRepository.findByIds(candidateIds);

  const matched = mails.filter((mail) => {
    if (!participates(mail, userId)) return false;
    const fieldText = getFieldText(mail, searchType).toLowerCase();
    return tokens.every((t) => fieldText.includes(t));
  });

  // 3) Newest first.
  matched.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return toMailDTOList(matched, userId);
}

/** Diagnostic. */
export function getStrategyName() {
  return searchContext.strategyName;
}
