import { asyncHandler } from '../../core/base/base.controller.js';
import { ApiResponse } from '../../core/base/api.response.js';
import { authService } from './auth.service.js';
import { AuthMapper } from './auth.mapper.js';

export const authController = {
  register: asyncHandler(async (req, res) => {
    const { user, token } = await authService.register(req.body);
    ApiResponse.created(res, AuthMapper.toAuthDto(user, token), 'Registered');
  }),

  login: asyncHandler(async (req, res) => {
    const { user, token } = await authService.login(req.body);
    ApiResponse.ok(res, AuthMapper.toAuthDto(user, token), 'Logged in');
  }),

  logout: asyncHandler(async (_req, res) => {
    ApiResponse.ok(res, null, 'Logged out');
  }),
};
