import * as userService from './user.service.js';
import { asyncHandler } from '../../shared/utils/async-handler.util.js';
import { ok } from '../../shared/utils/response.util.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  ok(res, users);
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  ok(res, user);
});
