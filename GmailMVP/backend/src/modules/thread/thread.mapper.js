import { toUserDTO } from '../user/user.mapper.js';
import { toMailDTOList } from '../mail/mail.mapper.js';

/**
 * Build a ThreadDTO. Mails are chronological (oldest first).
 * @param {object} thread     Thread doc
 * @param {object[]} mails    populated Mail docs (already sorted oldest-first)
 * @param {object[]} participants populated User docs
 * @param {string} [viewerUserId]
 * @returns {object} ThreadDTO
 */
export function toThreadDTO(thread, mails = [], participants = [], viewerUserId) {
  return {
    id: String(thread._id ?? thread.id),
    subject: thread.subject || '',
    participants: participants.map(toUserDTO).filter(Boolean),
    mails: toMailDTOList(mails, viewerUserId),
  };
}
