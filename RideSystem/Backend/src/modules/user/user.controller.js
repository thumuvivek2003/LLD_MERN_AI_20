import { asyncHandler } from '../../core/base/base.controller.js';
import { ApiResponse } from '../../core/base/api.response.js';
import { userService } from './user.service.js';
import { UserMapper } from './user.mapper.js';

export const userController = {
  me: asyncHandler(async (req, res) => {
    const user = await userService.getProfile(req.user.id);
    ApiResponse.ok(res, UserMapper.toDto(user));
  }),

  updateMe: asyncHandler(async (req, res) => {
    const user = await userService.updateProfile(req.user.id, req.body);
    ApiResponse.ok(res, UserMapper.toDto(user), 'Profile updated');
  }),
};
