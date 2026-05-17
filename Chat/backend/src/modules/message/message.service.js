import * as messageRepo from './message.repository.js';
import * as chatRepo from '../chat/chat.repository.js';
import * as deliveryRepo from '../delivery/delivery.repository.js';
import { selectMessageStrategy } from './strategies/index.js';
import { toMessageResponse } from './message.mapper.js';
import { AppError, ERROR_CODES } from '../../shared/constants/errors.constant.js';
import { UserModel } from '../../models/user.model.js';
import { publish } from '../../events/event-bus.js';
import { EVENTS } from '../../events/event.constants.js';

/**
 * Core send flow:
 *  1. Validate membership.
 *  2. Persist message.
 *  3. Use Strategy to build per-member status rows.
 *  4. Bulk-create those rows.
 *  5. Update chat lastMessageAt.
 *  6. Publish MESSAGE_CREATED on EventBus (socket subscriber fans out).
 *  7. Return mapped DTO to caller.
 */
export async function createMessage({ senderId, chatId, content }) {
  if (!content || !String(content).trim()) {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Message content is required');
  }
  const chat = await chatRepo.findById(chatId);
  if (!chat) throw new AppError(ERROR_CODES.NOT_FOUND, 'Chat not found');
  const membership = await chatRepo.getMembership(chatId, senderId);
  if (!membership) throw new AppError(ERROR_CODES.FORBIDDEN, 'Not a member of this chat');

  const members = await chatRepo.getMembers(chatId);
  const message = await messageRepo.create({
    chatId,
    senderId,
    content: String(content).trim(),
  });

  const strategy = selectMessageStrategy(chat.type);
  const rows = strategy.process({ message, members });
  const statuses = await deliveryRepo.bulkCreateStatuses(rows);

  await chatRepo.updateLastMessageAt(chatId, message.createdAt);

  const dto = await buildMessageDto({ message, statuses, viewerUserId: senderId });

  // Publish to event bus: socket subscriber will fan-out to recipients
  // and the delivery/presence subscribers can react too.
  publish(EVENTS.MESSAGE_CREATED, {
    message,
    chatId: String(chatId),
    chatType: chat.type,
    senderId: String(senderId),
    memberIds: members.map((m) => String(m.userId)),
    dto,
  });

  return dto;
}

export async function fetchMessages({ userId, chatId, limit, before }) {
  const membership = await chatRepo.getMembership(chatId, userId);
  if (!membership) throw new AppError(ERROR_CODES.FORBIDDEN, 'Not a member of this chat');

  const docs = await messageRepo.findChatMessages(chatId, { limit, before });
  // Sort ascending (oldest first / newest last) for UI consumption.
  docs.reverse();
  if (!docs.length) return [];

  const messageIds = docs.map((d) => d._id);
  const allStatuses = await deliveryRepo.findByMessages(messageIds);
  const statusByMessage = new Map();
  for (const s of allStatuses) {
    const k = String(s.messageId);
    if (!statusByMessage.has(k)) statusByMessage.set(k, []);
    statusByMessage.get(k).push(s);
  }

  const userIdsSet = new Set();
  for (const d of docs) userIdsSet.add(String(d.senderId));
  for (const s of allStatuses) userIdsSet.add(String(s.userId));
  const users = await UserModel.find({ _id: { $in: [...userIdsSet] } }).lean();
  const userMap = new Map(users.map((u) => [String(u._id), u]));

  return docs.map((m) =>
    toMessageResponse({
      message: m,
      statuses: statusByMessage.get(String(m._id)) || [],
      userMap,
      viewerUserId: userId,
    })
  );
}

/**
 * Build a single message DTO from a fresh message + status rows.
 */
export async function buildMessageDto({ message, statuses, viewerUserId }) {
  const userIds = new Set([String(message.senderId)]);
  for (const s of statuses || []) userIds.add(String(s.userId));
  const users = await UserModel.find({ _id: { $in: [...userIds] } }).lean();
  const userMap = new Map(users.map((u) => [String(u._id), u]));
  return toMessageResponse({ message, statuses: statuses || [], userMap, viewerUserId });
}
