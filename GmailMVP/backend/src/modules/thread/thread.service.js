import * as threadRepository from './thread.repository.js';
import * as mailRepository from '../mail/mail.repository.js';
import * as userRepository from '../user/user.repository.js';
import { toThreadDTO } from './thread.mapper.js';
import { AppError } from '../../shared/utils/app-error.util.js';

/**
 * Create a thread for a root mail (idempotent by _id).
 * Invoked by the thread subscriber on MAIL_SENT (root mail).
 * @param {{_id:any, subject:string, mailIds:any[], participants:any[]}} payload
 */
export function createThread(payload) {
  return threadRepository.save(payload);
}

/**
 * Append a reply's mail id to its thread and merge participants.
 * Invoked by the thread subscriber on MAIL_SENT (reply).
 * @param {any} threadId
 * @param {any} mailId
 * @param {any[]} participantIds
 */
export function appendReply(threadId, mailId, participantIds = []) {
  return threadRepository.update(threadId, mailId, participantIds);
}

/**
 * Load a full conversation as a ThreadDTO (mails oldest-first).
 * @param {string} threadId
 * @param {string} [viewerUserId]
 * @returns {Promise<object>} ThreadDTO
 */
export async function getConversation(threadId, viewerUserId) {
  const thread = await threadRepository.findById(threadId);
  if (!thread) throw AppError.notFound('Thread not found', 'THREAD_NOT_FOUND');

  const mails = await mailRepository.findByThread(threadId);
  const participants = await userRepository.findByIds(thread.participants || []);

  return toThreadDTO(thread, mails, participants, viewerUserId);
}
