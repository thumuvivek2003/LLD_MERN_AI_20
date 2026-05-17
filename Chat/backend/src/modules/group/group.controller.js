import * as groupService from './group.service.js';
import { successResponse } from '../../shared/utils/response.util.js';

export async function addMembers(req, res, next) {
  try {
    const updated = await groupService.addUsersToGroup({
      chatId: req.params.chatId,
      requesterId: req.user.id,
      memberIds: req.body.memberIds || [],
    });
    return successResponse(res, updated);
  } catch (err) {
    next(err);
  }
}

export async function removeMember(req, res, next) {
  try {
    const updated = await groupService.removeUserFromGroup({
      chatId: req.params.chatId,
      requesterId: req.user.id,
      userId: req.params.userId,
    });
    return successResponse(res, updated);
  } catch (err) {
    next(err);
  }
}

export async function renameGroup(req, res, next) {
  try {
    const updated = await groupService.renameGroup({
      chatId: req.params.chatId,
      requesterId: req.user.id,
      name: req.body.name,
    });
    return successResponse(res, updated);
  } catch (err) {
    next(err);
  }
}
