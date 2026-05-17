import { Router } from 'express';
import { register, login } from './auth.controller.js';
import { validateRequest } from '../../common/middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from './auth.validation.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

export default router;
