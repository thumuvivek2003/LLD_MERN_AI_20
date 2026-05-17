import * as chatService from './chat.service.js';
import { CHAT_TYPES } from './chat.constants.js';
import { successResponse } from '../../shared/utils/response.util.js';

export async function getChats(req, res, next) {
  try {
    const chats = await chatService.fetchUserChats(req.user.id);
    return successResponse(res, chats);
  } catch (err) {
    next(err);
  }
}

export async function getChatById(req, res, next) {
  try {
    const chat = await chatService.fetchChatById(req.params.chatId, req.user.id);
    return successResponse(res, chat);
  } catch (err) {
    next(err);
  }
}

export async function createDirectChat(req, res, next) {
  try {
    const chat = await chatService.createChat({
      type: CHAT_TYPES.DIRECT,
      currentUserId: req.user.id,
      userId: req.body.userId,
    });
    const full = await chatService.fetchChatById(chat._id, req.user.id);
    return successResponse(res, full);
  } catch (err) {
    next(err);
  }
}

export async function createGroupChat(req, res, next) {
  try {
    const chat = await chatService.createChat({
      type: CHAT_TYPES.GROUP,
      currentUserId: req.user.id,
      name: req.body.name,
      memberIds: req.body.memberIds || [],
    });
    const full = await chatService.fetchChatById(chat._id, req.user.id);
    return successResponse(res, full);
  } catch (err) {
    next(err);
  }
}
