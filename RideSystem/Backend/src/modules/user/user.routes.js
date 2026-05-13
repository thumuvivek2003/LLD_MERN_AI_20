import { Router } from 'express';
import { authMiddleware } from '../../core/middleware/auth.middleware.js';
import { validate } from '../../core/middleware/validate.middleware.js';
import { userController } from './user.controller.js';
import { validateUpdate } from './user.validation.js';

const router = Router();

router.get('/me', authMiddleware, userController.me);
router.put('/me', authMiddleware, validate(validateUpdate), userController.updateMe);

export default router;
