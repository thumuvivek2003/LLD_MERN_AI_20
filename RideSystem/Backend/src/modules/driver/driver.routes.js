import { Router } from 'express';
import { authMiddleware } from '../../core/middleware/auth.middleware.js';
import { requireRole } from '../../core/middleware/role.middleware.js';
import { validate } from '../../core/middleware/validate.middleware.js';
import { ROLES } from '../../config/constants.js';
import { driverController } from './driver.controller.js';
import { validateStatus, validateLocation } from './driver.validation.js';

const router = Router();

router.use(authMiddleware);

router.get('/me', requireRole(ROLES.DRIVER), driverController.me);
router.put('/status', requireRole(ROLES.DRIVER), validate(validateStatus), driverController.setStatus);
router.put('/location', requireRole(ROLES.DRIVER), validate(validateLocation), driverController.updateLocation);
router.get('/online', driverController.listOnline);

export default router;
