import { MAIL_STATUS } from '../../shared/constants/mail-status.constant.js';
import { toUserDTO } from '../user/user.mapper.js';

const SNIPPET_LENGTH = 90;

function buildSnippet(body = '') {
  const clean = String(body).replace(/\s+/g, ' ').trim();
  if (clean.length <= SNIPPET_LENGTH) return clean;
  return `${clean.slice(0, SNIPPET_LENGTH).trim()}…`;
}

function idIn(list = [], id) {
  const target = String(id);
  return list.some((entry) => String(entry?._id ?? entry) === target);
}

/**
 * Map a (populated) Mail document to the shared MailDTO shape.
 * The DTO is viewer-aware: `isRead` and the derived READ/UNREAD `status`
 * are computed relative to `viewerUserId`.
 *
 * @param {object} mail   Mail doc with `sender` and `receivers` populated
 * @param {string} [viewerUserId] the user viewing this mail
 * @returns {object} MailDTO
 */
export function toMailDTO(mail, viewerUserId) {
  if (!mail) return null;

  const isRead = viewerUserId ? idIn(mail.readBy, viewerUserId) : false;

  // Derived per-viewer status: READ if the viewer has read it, else UNREAD.
  // Falls back to the stored status when there's no viewer context.
  let status = mail.status || MAIL_STATUS.SENT;
  if (viewerUserId) {
    status = isRead ? MAIL_STATUS.READ : MAIL_STATUS.UNREAD;
  }

  return {
    id: String(mail._id ?? mail.id),
    threadId: String(mail.threadId?._id ?? mail.threadId),
    sender: toUserDTO(mail.sender),
    receivers: (mail.receivers || []).map(toUserDTO).filter(Boolean),
    subject: mail.subject || '',
    body: mail.body || '',
    timestamp: new Date(mail.timestamp).toISOString(),
    status,
    isRead,
    snippet: buildSnippet(mail.body),
  };
}

/**
 * @param {object[]} mails
 * @param {string} [viewerUserId]
 * @returns {object[]}
 */
export function toMailDTOList(mails = [], viewerUserId) {
  return mails.map((m) => toMailDTO(m, viewerUserId)).filter(Boolean);
}
