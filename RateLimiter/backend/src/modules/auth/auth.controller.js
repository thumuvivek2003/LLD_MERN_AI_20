import { authService } from './auth.service.js';
import { validateLoginPayload, validateRegisterPayload } from './auth.validation.js';

export const authController = {
  async login(req, res, next) {
    try {
      const { username, password } = validateLoginPayload(req.body);
      const result = await authService.login(username, password);
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  },

  async registerClient(req, res, next) {
    try {
      const { username, password } = validateRegisterPayload(req.body);
      const result = await authService.register({ username, password, role: 'client' });
      return res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  },

  async me(req, res, next) {
    try {
      const result = await authService.me(req.user.sub);
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  },
};
