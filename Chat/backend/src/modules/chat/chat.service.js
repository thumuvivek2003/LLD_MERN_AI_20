import * as chatRepo from './chat.repository.js';
import * as chatFactory from './chat.factory.js';
import { CHAT_TYPES } from './chat.constants.js';
import { AppError, ERROR_CODES } from '../../shared/constants/errors.constant.js';
import { UserModel } from '../../models/user.model.js';
import { MessageModel } from '../../models/message.model.js';
import { MessageStatusModel } from '../../models/delivery.model.js';
import { MESSAGE_STATUS, statusRank } from '../delivery/delivery.constants.js';
import { toMemberResponse } from '../user/user.mapper.js';

/**
 * Factory dispatch entry point used by controllers/socket. Defends caller
 * from caring about DIRECT vs GROUP creation specifics.
 */
export async function createChat({ type, currentUserId, userId, name, memberIds }) {
  if (type === CHAT_TYPES.DIRECT) {
    if (!userId) throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'userId is required');
    if (String(userId) === String(currentUserId)) {
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Cannot create a chat with yourself');
    }
    const other = await UserModel.findById(userId).lean();
    if (!other) throw new AppError(ERROR_CODES.NOT_FOUND, 'Target user not found');
    return chatFactory.createDirectChat({ userIdA: currentUserId, userIdB: userId });
  }
  if (type === CHAT_TYPES.GROUP) {
    if (!name || !name.trim()) {
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Group name is required');
    }
    return chatFactory.createGroupChat({
      name: name.trim(),
      createdBy: currentUserId,
      memberIds: memberIds || [],
    });
  }
  throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Unknown chat type');
}

export async function fetchUserChats(userId) {
  const chats = await chatRepo.findChatsForUser(userId);
  const enriched = [];
  for (const chat of chats) {
    enriched.push(await buildChatResponse(chat, userId));
  }
  return enriched;
}

export async function fetchChatById(chatId, currentUserId) {
  const chat = await chatRepo.findById(chatId);
  if (!chat) throw new AppError(ERROR_CODES.NOT_FOUND, 'Chat not found');
  const membership = await chatRepo.getMembership(chatId, currentUserId);
  if (!membership) throw new AppError(ERROR_CODES.FORBIDDEN, 'Not a member of this chat');
  return buildChatResponse(chat, currentUserId);
}

export async function assertMembership(chatId, userId) {
  const membership = await chatRepo.getMembership(chatId, userId);
  if (!membership) throw new AppError(ERROR_CODES.FORBIDDEN, 'Not a member of this chat');
  return membership;
}

export async function assertGroupAdmin(chatId, userId) {
  const chat = await chatRepo.findById(chatId);
  if (!chat) throw new AppError(ERROR_CODES.NOT_FOUND, 'Chat not found');
  if (chat.type !== CHAT_TYPES.GROUP) {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Only group chats support this operation');
  }
  const membership = await chatRepo.getMembership(chatId, userId);
  if (!membership || membership.role !== 'ADMIN') {
    throw new AppError(ERROR_CODES.FORBIDDEN, 'Group admin required');
  }
  return { chat, membership };
}

/**
 * Aggregates the chat into the API shape including members, last message,
 * unread count and computed status for the viewer.
 */
export async function buildChatResponse(chat, viewerUserId) {
  const chatId = chat._id;
  const memberDocs = await chatRepo.getMembers(chatId);
  const memberUserIds = memberDocs.map((m) => m.userId);
  const userDocs = await UserModel.find({ _id: { $in: memberUserIds } }).lean();
  const userById = new Map(userDocs.map((u) => [String(u._id), u]));

  const members = memberDocs
    .map((m) => {
      const u = userById.get(String(m.userId));
      return u ? toMemberResponse(u, m.role) : null;
    })
    .filter(Boolean);

  // Display name: for DIRECT chats use the other user's name.
  let displayName = chat.name;
  if (chat.type === CHAT_TYPES.DIRECT) {
    const other = members.find((m) => String(m.userId) !== String(viewerUserId));
    displayName = other?.name || 'Chat';
  }

  // Last message
  const lastMsg = await MessageModel.findOne({ chatId }).sort({ createdAt: -1 }).lean();
  let lastMessage = null;
  if (lastMsg) {
    lastMessage = {
      id: String(lastMsg._id),
      content: lastMsg.content,
      senderId: String(lastMsg.senderId),
      createdAt: new Date(lastMsg.createdAt).toISOString(),
      status: await computeAggregatedStatusForSender(lastMsg, chat, viewerUserId),
    };
  }

  // Unread count: messages where viewer's MessageStatus is not READ AND viewer is not the sender.
  const unreadCount = await MessageStatusModel.countDocuments({
    chatId,
    userId: viewerUserId,
    status: { $ne: MESSAGE_STATUS.READ },
  });

  return {
    id: String(chatId),
    type: chat.type,
    name: displayName,
    avatar: chat.avatar || null,
    createdBy: String(chat.createdBy),
    members,
    lastMessage,
    unreadCount,
    updatedAt: new Date(chat.lastMessageAt || chat.updatedAt || chat.createdAt).toISOString(),
  };
}

/**
 * For the sender's view: aggregated message status (min across recipients).
 * For non-sender viewer the value falls back to their own status row.
 */
async function computeAggregatedStatusForSender(message, chat, viewerUserId) {
  const senderIsViewer = String(message.senderId) === String(viewerUserId);
  if (!senderIsViewer) {
    // Viewer's own status row, default to SENT.
    const own = await MessageStatusModel.findOne({
      messageId: message._id,
      userId: viewerUserId,
    }).lean();
    return own?.status || MESSAGE_STATUS.SENT;
  }
  const recipientStatuses = await MessageStatusModel.find({
    messageId: message._id,
    userId: { $ne: message.senderId },
  }).lean();
  if (!recipientStatuses.length) return MESSAGE_STATUS.SENT;
  return recipientStatuses.reduce((min, s) => {
    return statusRank(s.status) < statusRank(min) ? s.status : min;
  }, MESSAGE_STATUS.READ);
}
