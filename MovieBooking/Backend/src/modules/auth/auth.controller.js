import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { successResponse } from '../../shared/utils/apiResponse.js';
import * as service from './auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const user = await service.register(req.body);
  return successResponse(res, user, 'Registered successfully', 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await service.login(req.body);
  return successResponse(res, result, 'Login successful');
});

export const logout = asyncHandler(async (req, res) => {
  return successResponse(res, null, 'Logged out');
});

export const me = asyncHandler(async (req, res) => {
  return successResponse(res, req.user);
});
