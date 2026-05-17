import { authService } from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../dtos/auth.dto.js';
import { successResponse } from '../../../shared/utils/response.util.js';

export const authController = {
  async register(req, res, next) {
    try {
      const body = registerSchema.parse(req.body);
      const result = await authService.createUser(body, req.user);
      return successResponse(res, result, 201);
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const body = loginSchema.parse(req.body);
      const result = await authService.authenticateUser(body);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  },

  async me(req, res, next) {
    try {
      const user = await authService.getMe(req.user.id);
      return successResponse(res, { user });
    } catch (err) {
      next(err);
    }
  },
};
