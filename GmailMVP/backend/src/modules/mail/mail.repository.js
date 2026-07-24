import { Mail } from './mail.model.js';

/**
 * Data-access layer for mails. All read methods populate sender & receivers
 * so mappers can embed full UserDTOs.
 */

const POPULATE = [
  { path: 'sender', select: 'name email avatarColor' },
  { path: 'receivers', select: 'name email avatarColor' },
];

/**
 * Persist a new mail payload.
 * @param {object} payload
 * @returns {Promise<object>} populated saved mail
 */
export async function save(payload) {
  const created = await Mail.create(payload);
  return created.populate(POPULATE);
}

export function findById(id) {
  return Mail.findById(id).populate(POPULATE).exec();
}

export function findByIds(ids = []) {
  return Mail.find({ _id: { $in: ids } }).populate(POPULATE).exec();
}

/** Inbox: mails where the user is a receiver, newest first. */
export function findInbox(userId) {
  return Mail.find({ receivers: userId })
    .sort({ timestamp: -1 })
    .populate(POPULATE)
    .exec();
}

/** Sent: mails the user sent, newest first. */
export function findSent(userId) {
  return Mail.find({ sender: userId })
    .sort({ timestamp: -1 })
    .populate(POPULATE)
    .exec();
}

/** All mails in a thread, oldest first (chronological). */
export function findByThread(threadId) {
  return Mail.find({ threadId })
    .sort({ timestamp: 1 })
    .populate(POPULATE)
    .exec();
}

/** All mails a user participates in (sender or receiver). */
export function findByParticipant(userId) {
  return Mail.find({ $or: [{ sender: userId }, { receivers: userId }] })
    .sort({ timestamp: -1 })
    .populate(POPULATE)
    .exec();
}

/** Every mail (used to build the search index at startup). */
export function findAll() {
  return Mail.find().sort({ timestamp: 1 }).populate(POPULATE).exec();
}

/** Add a user to a mail's readBy set (idempotent). Returns populated mail. */
export function markRead(mailId, userId) {
  return Mail.findByIdAndUpdate(
    mailId,
    { $addToSet: { readBy: userId } },
    { new: true }
  )
    .populate(POPULATE)
    .exec();
}

export function count() {
  return Mail.estimatedDocumentCount().exec();
}
