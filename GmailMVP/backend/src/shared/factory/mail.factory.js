import { MAIL_STATUS } from '../constants/mail-status.constant.js';

/**
 * MailFactory (Factory pattern)
 * ------------------------------------------------------------------
 * Centralizes construction of mail payloads so services don't hand-assemble
 * documents. Produces plain objects ready to be persisted by the repository.
 *
 * Convention: the sender is auto-added to `readBy` (you've read what you sent).
 */
export class MailFactory {
  /**
   * Build a brand-new mail (root of a thread).
   * @param {object} params
   * @param {string} params.threadId    pre-generated thread id
   * @param {string} params.senderId
   * @param {string[]} params.receiverIds
   * @param {string} params.subject
   * @param {string} params.body
   * @returns {object} mail document payload
   */
  static createMail({ threadId, senderId, receiverIds, subject, body }) {
    return {
      threadId,
      sender: senderId,
      receivers: receiverIds,
      subject: (subject ?? '').trim(),
      body: body ?? '',
      timestamp: new Date(),
      status: MAIL_STATUS.SENT,
      readBy: [senderId],
    };
  }

  /**
   * Build a reply within an existing thread. Subject reuses the parent's,
   * prefixed with "Re: " unless it already starts with one.
   * @param {object} params
   * @param {string} params.threadId       parent thread id
   * @param {string} params.senderId
   * @param {string[]} params.receiverIds  recipients (parent participants minus replier)
   * @param {string} params.parentSubject
   * @param {string} params.body
   * @returns {object} mail document payload
   */
  static createReply({ threadId, senderId, receiverIds, parentSubject, body }) {
    const base = (parentSubject ?? '').trim();
    const subject = /^re:/i.test(base) ? base : `Re: ${base}`;
    return {
      threadId,
      sender: senderId,
      receivers: receiverIds,
      subject,
      body: body ?? '',
      timestamp: new Date(),
      status: MAIL_STATUS.SENT,
      readBy: [senderId],
    };
  }
}

export default MailFactory;
