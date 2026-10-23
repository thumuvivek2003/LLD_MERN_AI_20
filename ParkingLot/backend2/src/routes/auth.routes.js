import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';

export const authRoutes = (controller) => {
  const router = Router();
  router.post('/register', validate(registerValidator), controller.register);
  router.post('/login', validate(loginValidator), controller.login);
  return router;
};
