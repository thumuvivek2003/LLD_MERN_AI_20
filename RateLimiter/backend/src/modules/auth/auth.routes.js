import { Router } from 'express';
import { authController } from './auth.controller.js';
import { authenticate } from '../rateLimiter/middleware/admin.middleware.js';

export function registerAuthRoutes() {
  const router = Router();
  router.post('/login', authController.login);
  router.post('/register', authController.registerClient);
  router.get('/me', authenticate, authController.me);
  return router;
}
