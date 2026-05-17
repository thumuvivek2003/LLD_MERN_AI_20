import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../../../shared/middleware/auth.middleware.js';

const router = Router();

// register is public; if a bearer is present we attach req.user so ADMIN can mint ADMINs.
router.post('/register', optionalAuth, authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.me);

export default router;

function optionalAuth(req, res, next) {
  if (!req.headers.authorization) return next();
  // swallow auth failure — register stays open; missing/invalid token simply means "no actor".
  return authenticate(req, res, () => next());
}
