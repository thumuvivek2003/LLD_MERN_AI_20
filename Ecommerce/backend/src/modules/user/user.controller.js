import { userService } from './user.service.js';
import { successResponse } from '../../common/utils/response.util.js';
import { asyncHandler } from '../../common/middlewares/validate.middleware.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserProfile(req.user._id);
  return successResponse(res, { user });
});

export const block = asyncHandler(async (req, res) => {
  const user = await userService.blockUser(req.params.id);
  return successResponse(res, { user });
});

export const unblock = asyncHandler(async (req, res) => {
  const user = await userService.unblockUser(req.params.id);
  return successResponse(res, { user });
});
