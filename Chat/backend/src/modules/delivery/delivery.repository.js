import { MessageStatusModel } from '../../models/delivery.model.js';
import { MESSAGE_STATUS } from './delivery.constants.js';

export async function createStatus({ messageId, chatId, userId, status }) {
  return MessageStatusModel.findOneAndUpdate(
    { messageId, userId },
    { $setOnInsert: { messageId, chatId, userId, status, timestamp: new Date() } },
    { upsert: true, new: true }
  ).lean();
}

export async function bulkCreateStatuses(rows) {
  if (!rows.length) return [];
  const ops = rows.map((r) => ({
    updateOne: {
      filter: { messageId: r.messageId, userId: r.userId },
      update: {
        $setOnInsert: {
          messageId: r.messageId,
          chatId: r.chatId,
          userId: r.userId,
          status: r.status,
          timestamp: new Date(),
        },
      },
      upsert: true,
    },
  }));
  await MessageStatusModel.bulkWrite(ops);
  return MessageStatusModel.find({
    messageId: { $in: rows.map((r) => r.messageId) },
  }).lean();
}

export async function updateStatus({ messageId, userId, status }) {
  return MessageStatusModel.findOneAndUpdate(
    { messageId, userId },
    { $set: { status, timestamp: new Date() } },
    { new: true }
  ).lean();
}

export function findByMessage(messageId) {
  return MessageStatusModel.find({ messageId }).lean();
}

export function findByMessages(messageIds) {
  return MessageStatusModel.find({ messageId: { $in: messageIds } }).lean();
}

export function findUserStatus(messageId, userId) {
  return MessageStatusModel.findOne({ messageId, userId }).lean();
}

export function findChatRecipientStatuses(chatId, userId, statuses = [MESSAGE_STATUS.SENT, MESSAGE_STATUS.DELIVERED]) {
  return MessageStatusModel.find({
    chatId,
    userId,
    status: { $in: statuses },
  }).lean();
}
