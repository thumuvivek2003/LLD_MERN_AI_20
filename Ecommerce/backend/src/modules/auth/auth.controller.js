import { authService } from './auth.service.js';
import { successResponse } from '../../common/utils/response.util.js';
import { asyncHandler } from '../../common/middlewares/validate.middleware.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  return successResponse(res, result, 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  return successResponse(res, result);
});
