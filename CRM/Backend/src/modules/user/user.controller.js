import { asyncHandler } from '../../core/base/base.controller.js';
import { ApiResponse } from '../../core/base/api.response.js';
import { BadRequestError } from '../../core/exceptions/bad-request.error.js';

export const userController = {
  list: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.userService.list());
  }),

  me: asyncHandler(async (req, res) => {
    ApiResponse.ok(res, await req.container.userService.me(req.actor));
  }),

  assignRole: asyncHandler(async (req, res) => {
    if (!req.body?.roleId) throw new BadRequestError('roleId is required');
    ApiResponse.ok(res, await req.container.userService.assignRole(req.params.userId, req.body.roleId));
  }),
};
