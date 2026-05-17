import * as messageService from './message.service.js';
import * as deliveryService from '../delivery/delivery.service.js';
import { successResponse } from '../../shared/utils/response.util.js';
import { DEFAULT_MESSAGE_PAGE_SIZE } from '../../shared/constants/app.constant.js';

export async function sendMessage(req, res, next) {
  try {
    const { chatId, content, tempId } = req.body;
    const message = await messageService.createMessage({
      senderId: req.user.id,
      chatId,
      content,
    });
    return successResponse(res, { ...message, tempId });
  } catch (err) {
    next(err);
  }
}

export async function getMessages(req, res, next) {
  try {
    const { chatId } = req.params;
    const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_MESSAGE_PAGE_SIZE, 100);
    const before = req.query.before || null;
    const messages = await messageService.fetchMessages({
      userId: req.user.id,
      chatId,
      limit,
      before,
    });
    return successResponse(res, messages);
  } catch (err) {
    next(err);
  }
}

export async function markMessageRead(req, res, next) {
  try {
    const { messageId } = req.params;
    const updated = await deliveryService.markMessageRead({
      userId: req.user.id,
      messageId,
    });
    return successResponse(res, {
      messageId,
      status: updated?.status || 'READ',
    });
  } catch (err) {
    next(err);
  }
}

export async function markChatReadAll(req, res, next) {
  try {
    const { chatId } = req.params;
    const result = await deliveryService.markChatReadAll({
      userId: req.user.id,
      chatId,
    });
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
}
