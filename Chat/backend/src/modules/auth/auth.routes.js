import { Router } from 'express';
import * as controller from './auth.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { validateMobile, validateOtp } from './auth.validator.js';

export function registerAuthRoutes() {
  const router = Router();
  router.post('/login', validate(validateMobile), controller.loginWithMobile);
  router.post('/verify-otp', validate(validateOtp), controller.verifyOtp);
  router.post('/logout', authenticate, controller.logout);
  return router;
}
