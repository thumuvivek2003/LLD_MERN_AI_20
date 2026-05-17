import { MESSAGE_STATUS } from '../../delivery/delivery.constants.js';

/**
 * Direct chat delivery strategy: produces SENT status rows for the
 * single recipient and READ for sender.
 */
export const directMessageStrategy = {
  type: 'DIRECT',
  process({ message, members }) {
    const rows = [];
    for (const m of members) {
      const isSender = String(m.userId) === String(message.senderId);
      rows.push({
        messageId: message._id,
        chatId: message.chatId,
        userId: m.userId,
        status: isSender ? MESSAGE_STATUS.READ : MESSAGE_STATUS.SENT,
      });
    }
    return rows;
  },
};

export const process = directMessageStrategy.process;
