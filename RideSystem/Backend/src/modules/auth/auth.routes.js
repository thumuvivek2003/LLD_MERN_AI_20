import { Router } from 'express';
import { validate } from '../../core/middleware/validate.middleware.js';
import { authController } from './auth.controller.js';
import { validateRegister, validateLogin } from './auth.validation.js';

const router = Router();

router.post('/register', validate(validateRegister), authController.register);
router.post('/login', validate(validateLogin), authController.login);
router.post('/logout', authController.logout);

export default router;
