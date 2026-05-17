import { MessageModel } from '../../models/message.model.js';

export async function create({ chatId, senderId, content }) {
  const msg = await MessageModel.create({ chatId, senderId, content });
  return msg.toObject();
}

export function findById(id) {
  return MessageModel.findById(id).lean();
}

export function findChatMessages(chatId, { limit = 50, before } = {}) {
  const filter = { chatId };
  if (before) {
    // "before" is a message id; load messages older than it.
    filter._id = { $lt: before };
  }
  return MessageModel.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
}

export function countToday() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return MessageModel.countDocuments({ createdAt: { $gte: start } });
}
