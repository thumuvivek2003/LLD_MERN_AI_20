import { AppError } from '../../shared/utils/app-error.util.js';

/**
 * Validate the POST /api/mails/send body.
 * @param {object} body
 * @returns {{senderId:string, to:string[], subject:string, body:string}}
 */
export function validateSend(body = {}) {
  const { senderId, to, subject, body: content } = body;

  if (!senderId || typeof senderId !== 'string') {
    throw AppError.badRequest('senderId is required', 'INVALID_SENDER');
  }
  if (!Array.isArray(to) || to.length === 0) {
    throw AppError.badRequest('to must be a non-empty array of user ids', 'INVALID_RECIPIENTS');
  }
  if (to.some((id) => typeof id !== 'string' || !id.trim())) {
    throw AppError.badRequest('to contains invalid user ids', 'INVALID_RECIPIENTS');
  }
  if (typeof subject !== 'string' || !subject.trim()) {
    throw AppError.badRequest('subject is required', 'INVALID_SUBJECT');
  }
  if (typeof content !== 'string' || !content.trim()) {
    throw AppError.badRequest('body is required', 'INVALID_BODY');
  }

  return {
    senderId,
    to: [...new Set(to.map((id) => id.trim()))],
    subject: subject.trim(),
    body: content,
  };
}

/**
 * Validate the POST /api/mails/:id/reply body.
 * @param {object} body
 * @returns {{senderId:string, body:string}}
 */
export function validateReply(body = {}) {
  const { senderId, body: content } = body;
  if (!senderId || typeof senderId !== 'string') {
    throw AppError.badRequest('senderId is required', 'INVALID_SENDER');
  }
  if (typeof content !== 'string' || !content.trim()) {
    throw AppError.badRequest('body is required', 'INVALID_BODY');
  }
  return { senderId, body: content };
}
