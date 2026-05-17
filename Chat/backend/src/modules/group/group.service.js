import * as groupRepo from './group.repository.js';
import * as chatService from '../chat/chat.service.js';
import { AppError, ERROR_CODES } from '../../shared/constants/errors.constant.js';
import { UserModel } from '../../models/user.model.js';
import { publish } from '../../events/event-bus.js';
import { EVENTS } from '../../events/event.constants.js';

export async function addUsersToGroup({ chatId, requesterId, memberIds }) {
  await chatService.assertGroupAdmin(chatId, requesterId);
  for (const uid of memberIds || []) {
    const exists = await UserModel.exists({ _id: uid });
    if (!exists) throw new AppError(ERROR_CODES.NOT_FOUND, `User ${uid} not found`);
    await groupRepo.addMember(chatId, uid, 'MEMBER');
  }
  const updated = await chatService.fetchChatById(chatId, requesterId);
  publish(EVENTS.CHAT_UPDATED, { chat: updated });
  return updated;
}

export async function removeUserFromGroup({ chatId, requesterId, userId }) {
  await chatService.assertGroupAdmin(chatId, requesterId);
  await groupRepo.removeMember(chatId, userId);
  const updated = await chatService.fetchChatById(chatId, requesterId);
  publish(EVENTS.CHAT_UPDATED, { chat: updated });
  return updated;
}

export async function renameGroup({ chatId, requesterId, name }) {
  await chatService.assertGroupAdmin(chatId, requesterId);
  if (!name || !name.trim()) {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'name is required');
  }
  await groupRepo.renameGroup(chatId, name.trim());
  const updated = await chatService.fetchChatById(chatId, requesterId);
  publish(EVENTS.CHAT_UPDATED, { chat: updated });
  return updated;
}
