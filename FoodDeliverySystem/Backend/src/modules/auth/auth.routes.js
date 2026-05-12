import { Router } from 'express';
import { register, login } from './auth.controller.js';
import { validateRequest } from '../../core/middlewares/validate.middleware.js';
import { registerValidation, loginValidation } from './auth.validator.js';

export const registerAuthRoutes = () => {
  const router = Router();
  router.post('/register', validateRequest(registerValidation), register);
  router.post('/login', validateRequest(loginValidation), login);
  return router;
};
