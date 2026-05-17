import * as userService from './user.service.js';
import { toUserResponse } from './user.mapper.js';
import { successResponse } from '../../shared/utils/response.util.js';

export async function getMyProfile(req, res, next) {
  try {
    const user = await userService.fetchProfile(req.user.id);
    return successResponse(res, toUserResponse(user));
  } catch (err) {
    next(err);
  }
}

export async function updateMyProfile(req, res, next) {
  try {
    const user = await userService.updateMyName(req.user.id, req.body.name);
    return successResponse(res, toUserResponse(user));
  } catch (err) {
    next(err);
  }
}

export async function getUsers(req, res, next) {
  try {
    const users = await userService.fetchUsers(req.user.id);
    return successResponse(res, users.map(toUserResponse));
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await userService.fetchUserById(req.params.id);
    return successResponse(res, toUserResponse(user));
  } catch (err) {
    next(err);
  }
}
