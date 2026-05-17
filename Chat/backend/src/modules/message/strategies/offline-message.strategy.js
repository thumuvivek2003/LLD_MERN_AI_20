import { MESSAGE_STATUS } from '../../delivery/delivery.constants.js';

/**
 * Offline recipients: status stays at SENT until they come online.
 * Used by the gateway / presence subscriber to retroactively mark
 * DELIVERED when a user reconnects. The "process" function here is
 * the identity strategy that preserves SENT entries.
 */
export const offlineMessageStrategy = {
  type: 'OFFLINE',
  process({ message, members }) {
    return members.map((m) => ({
      messageId: message._id,
      chatId: message.chatId,
      userId: m.userId,
      status: MESSAGE_STATUS.SENT,
    }));
  },
};

export const process = offlineMessageStrategy.process;
