import { Router } from 'express';
import { authMiddleware } from '../../core/middleware/auth.middleware.js';
import { requireRole } from '../../core/middleware/role.middleware.js';
import { validate } from '../../core/middleware/validate.middleware.js';
import { ROLES } from '../../config/constants.js';
import { adminController } from './admin.controller.js';
import { validateBlock } from './admin.validation.js';

const router = Router();
router.use(authMiddleware, requireRole(ROLES.ADMIN));

router.get('/dashboard', adminController.dashboard);
router.get('/riders', adminController.riders);
router.get('/drivers', adminController.drivers);
router.get('/rides', adminController.rides);
router.patch('/users/:userId/block', validate(validateBlock), adminController.block);

export default router;
