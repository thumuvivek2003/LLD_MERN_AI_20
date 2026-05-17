import { userService } from '../services/user.service.js';
import { successResponse } from '../../../shared/utils/response.util.js';

export const userController = {
  async getUsers(_req, res, next) {
    try {
      const users = await userService.getUsers();
      return successResponse(res, { users });
    } catch (err) {
      next(err);
    }
  },

  async getMembers(_req, res, next) {
    try {
      const users = await userService.getEligibleUsers();
      return successResponse(res, { users });
    } catch (err) {
      next(err);
    }
  },
};
