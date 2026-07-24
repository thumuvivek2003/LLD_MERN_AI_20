/**
 * Lifecycle / view status for a mail.
 * - SENT: persisted, initial status stored on the document.
 * - READ / UNREAD: derived per viewer by the mapper from the mail's `readBy` array.
 */
export const MAIL_STATUS = Object.freeze({
  SENT: 'SENT',
  READ: 'READ',
  UNREAD: 'UNREAD',
});
