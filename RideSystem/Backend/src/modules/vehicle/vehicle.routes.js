import { Router } from 'express';
import { authMiddleware } from '../../core/middleware/auth.middleware.js';
import { requireRole } from '../../core/middleware/role.middleware.js';
import { ROLES } from '../../config/constants.js';
import { vehicleController } from './vehicle.controller.js';

const router = Router();

router.use(authMiddleware, requireRole(ROLES.DRIVER));

router.post('/', vehicleController.create);
router.get('/me', vehicleController.listMine);

export default router;
