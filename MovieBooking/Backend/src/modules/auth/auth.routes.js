import { Router } from 'express';
import { register, login, logout, me } from './auth.controller.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { registerSchema, loginSchema } from '../../shared/validators/auth.validator.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

export default router;
