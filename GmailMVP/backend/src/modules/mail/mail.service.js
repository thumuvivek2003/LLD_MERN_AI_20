import mongoose from 'mongoose';
import * as mailRepository from './mail.repository.js';
import * as userRepository from '../user/user.repository.js';
import { toMailDTO, toMailDTOList } from './mail.mapper.js';
import { MailFactory } from '../../shared/factory/mail.factory.js';
import { eventBus } from '../../shared/singleton/event-bus.singleton.js';
import { MAIL_EVENTS } from '../../shared/observer/events/mail.events.js';
import { AppError } from '../../shared/utils/app-error.util.js';

/** Ensure a user exists; throw 404 otherwise. */
async function assertUserExists(userId, label = 'User') {
  const user = await userRepository.findById(userId);
  if (!user) throw AppError.notFound(`${label} not found`, 'USER_NOT_FOUND');
  return user;
}

/**
 * Send a brand-new mail (root of a new thread).
 * Persists the mail, then publishes MAIL_SENT so the thread / index / socket
 * subscribers react independently (Observer pattern).
 *
 * @param {{senderId:string, to:string[], subject:string, body:string}} dto
 * @returns {Promise<object>} MailDTO (from the sender's perspective)
 */
export async function send({ senderId, to, subject, body }) {
  await assertUserExists(senderId, 'Sender');

  const receivers = await userRepository.findByIds(to);
  if (receivers.length !== to.length) {
    throw AppError.badRequest('One or more recipients do not exist', 'INVALID_RECIPIENTS');
  }

  // Pre-generate the thread id so the mail can reference it immediately;
  // the thread document itself is created by the thread subscriber.
  const threadId = new mongoose.Types.ObjectId();

  const payload = MailFactory.createMail({
    threadId,
    senderId,
    receiverIds: to,
    subject,
    body,
  });

  const mail = await mailRepository.save(payload);

  eventBus.publish(MAIL_EVENTS.MAIL_SENT, { mail, isReply: false });

  return toMailDTO(mail, senderId);
}

/**
 * Reply within an existing thread. Reuses the parent thread + subject
 * (prefixed "Re: "). Recipients = original sender + other receivers minus
 * the replier.
 *
 * @param {string} parentMailId
 * @param {{senderId:string, body:string}} dto
 * @returns {Promise<object>} MailDTO (from the replier's perspective)
 */
export async function reply(parentMailId, { senderId, body }) {
  const parent = await mailRepository.findById(parentMailId);
  if (!parent) throw AppError.notFound('Mail not found', 'MAIL_NOT_FOUND');
  await assertUserExists(senderId, 'Sender');

  const everyone = [
    String(parent.sender?._id ?? parent.sender),
    ...(parent.receivers || []).map((r) => String(r?._id ?? r)),
  ];
  const receiverIds = [...new Set(everyone)].filter((id) => id !== String(senderId));

  if (receiverIds.length === 0) {
    throw AppError.badRequest('No recipients for this reply', 'INVALID_RECIPIENTS');
  }

  const payload = MailFactory.createReply({
    threadId: parent.threadId?._id ?? parent.threadId,
    senderId,
    receiverIds,
    parentSubject: parent.subject,
    body,
  });

  const mail = await mailRepository.save(payload);

  eventBus.publish(MAIL_EVENTS.MAIL_SENT, { mail, isReply: true });

  return toMailDTO(mail, senderId);
}

/**
 * @param {string} userId
 * @returns {Promise<object[]>} inbox MailDTOs, newest first
 */
export async function getInbox(userId) {
  await assertUserExists(userId);
  const mails = await mailRepository.findInbox(userId);
  return toMailDTOList(mails, userId);
}

/**
 * @param {string} userId
 * @returns {Promise<object[]>} sent MailDTOs, newest first
 */
export async function getSent(userId) {
  await assertUserExists(userId);
  const mails = await mailRepository.findSent(userId);
  return toMailDTOList(mails, userId);
}

/**
 * Fetch a single mail. If a viewer userId is supplied, mark it read for them.
 * @param {string} mailId
 * @param {string} [userId]
 * @returns {Promise<object>} MailDTO
 */
export async function getMail(mailId, userId) {
  let mail;
  if (userId) {
    mail = await mailRepository.markRead(mailId, userId);
  } else {
    mail = await mailRepository.findById(mailId);
  }
  if (!mail) throw AppError.notFound('Mail not found', 'MAIL_NOT_FOUND');
  return toMailDTO(mail, userId);
}
