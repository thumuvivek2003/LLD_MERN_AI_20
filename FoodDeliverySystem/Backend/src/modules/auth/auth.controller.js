import { authService } from './auth.service.js';
import { successResponse } from '../../core/utils/response.util.js';

export const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    successResponse(res, result, 'Registered', 201);
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    successResponse(res, result, 'Logged in');
  } catch (err) { next(err); }
};
