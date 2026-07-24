import { Thread } from './thread.model.js';

/** Data-access layer for threads. */

/**
 * Create a thread (idempotent by _id). If it already exists, returns existing.
 * @param {{_id:any, subject:string, mailIds:any[], participants:any[]}} payload
 */
export async function save(payload) {
  const existing = await Thread.findById(payload._id).exec();
  if (existing) return existing;
  return Thread.create(payload);
}

export function findById(id) {
  return Thread.findById(id).exec();
}

/**
 * Append a mail id + merge participants into an existing thread.
 * @param {any} threadId
 * @param {any} mailId
 * @param {any[]} participantIds
 */
export function update(threadId, mailId, participantIds = []) {
  return Thread.findByIdAndUpdate(
    threadId,
    {
      $addToSet: {
        mailIds: mailId,
        participants: { $each: participantIds },
      },
    },
    { new: true }
  ).exec();
}

export function count() {
  return Thread.estimatedDocumentCount().exec();
}
