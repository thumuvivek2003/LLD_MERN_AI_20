import * as deliveryRepo from './delivery.repository.js';
import { MESSAGE_STATUS, isForwardTransition } from './delivery.constants.js';
import { AppError, ERROR_CODES } from '../../shared/constants/errors.constant.js';
import { MessageModel } from '../../models/message.model.js';
import { publish } from '../../events/event-bus.js';
import { EVENTS } from '../../events/event.constants.js';
import { getStateHandler } from '../message/states/index.js';

/**
 * Move a single (messageId,userId) status forward only.
 * Uses the State pattern via getStateHandler.
 */
export async function transitionStatus({ messageId, userId, nextStatus }) {
  const current = await deliveryRepo.findUserStatus(messageId, userId);
  if (!current) return null;
  if (!isForwardTransition(current.status, nextStatus)) return current;
  const handler = getStateHandler(current.status);
  const target = handler.transition(nextStatus);
  return deliveryRepo.updateStatus({ messageId, userId, status: target });
}

export async function markDelivered({ messageId, userId }) {
  const message = await MessageModel.findById(messageId).lean();
  if (!message) return null;
  if (String(message.senderId) === String(userId)) return null;
  const updated = await transitionStatus({
    messageId,
    userId,
    nextStatus: MESSAGE_STATUS.DELIVERED,
  });
  if (updated && updated.status === MESSAGE_STATUS.DELIVERED) {
    publish(EVENTS.MESSAGE_DELIVERED, {
      messageId: String(messageId),
      chatId: String(message.chatId),
      userId: String(userId),
      timestamp: updated.timestamp || new Date(),
    });
  }
  return updated;
}

export async function markMessageRead({ messageId, userId }) {
  const message = await MessageModel.findById(messageId).lean();
  if (!message) throw new AppError(ERROR_CODES.NOT_FOUND, 'Message not found');
  const updated = await transitionStatus({
    messageId,
    userId,
    nextStatus: MESSAGE_STATUS.READ,
  });
  if (updated && updated.status === MESSAGE_STATUS.READ) {
    publish(EVENTS.MESSAGE_READ, {
      messageId: String(messageId),
      chatId: String(message.chatId),
      userId: String(userId),
      timestamp: updated.timestamp || new Date(),
    });
  }
  return updated;
}

/**
 * Marks every non-READ status row for this user in the chat as READ.
 */
export async function markChatReadAll({ chatId, userId }) {
  const rows = await deliveryRepo.findChatRecipientStatuses(chatId, userId, [
    MESSAGE_STATUS.SENT,
    MESSAGE_STATUS.DELIVERED,
  ]);
  let readCount = 0;
  for (const row of rows) {
    const updated = await transitionStatus({
      messageId: row.messageId,
      userId,
      nextStatus: MESSAGE_STATUS.READ,
    });
    if (updated && updated.status === MESSAGE_STATUS.READ) readCount += 1;
  }
  publish(EVENTS.CHAT_READ_ALL, {
    chatId: String(chatId),
    userId: String(userId),
    readCount,
    timestamp: new Date(),
  });
  return { chatId: String(chatId), readCount };
}

// Aliases kept for clarity / external use.
export const markRead = markMessageRead;
