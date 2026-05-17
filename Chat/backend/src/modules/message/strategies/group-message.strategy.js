import { MESSAGE_STATUS } from '../../delivery/delivery.constants.js';

/**
 * Group chat strategy: fan-out — every non-sender member gets SENT,
 * sender's row is READ.
 */
export const groupMessageStrategy = {
  type: 'GROUP',
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

export const process = groupMessageStrategy.process;
