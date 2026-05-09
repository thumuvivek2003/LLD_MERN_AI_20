import { AuthService } from '../services/AuthService.js';

const authService = new AuthService();

export class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.register(
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.role
      );
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body.email, req.body.password);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
