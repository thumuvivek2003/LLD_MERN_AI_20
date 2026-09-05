// modules/user/user.controller.js — thin HTTP layer, delegates to the service.
import { userService } from './user.service.js';

export const userController = {
  async list(_req, res, next) {
    try {
      res.json(await userService.listUsers());
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      res.json(await userService.loginUser(req.params.userId));
    } catch (err) {
      next(err);
    }
  },
};
