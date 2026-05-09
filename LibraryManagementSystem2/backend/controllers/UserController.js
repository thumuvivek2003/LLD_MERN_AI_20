import { UserService } from '../services/UserService.js';

const userService = new UserService();

export class UserController {
  async addUser(req, res, next) {
    try {
      const user = await userService.addUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  async activateUser(req, res, next) {
    try {
      const user = await userService.activateUser(req.params.id);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  async deactivateUser(req, res, next) {
    try {
      const user = await userService.deactivateUser(req.params.id);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  async assignRole(req, res, next) {
    try {
      const user = await userService.assignRole(req.params.id, req.body.role);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
}
