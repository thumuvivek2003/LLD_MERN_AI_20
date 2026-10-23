import { Router } from 'express';
import { slotController } from '../controllers/slot.controller.js';
import { authenticate } from '../../auth/middlewares/auth.middleware.js';
import { requireRole } from '../../../shared/middlewares/role.middleware.js';
import { asyncHandler } from '../../../shared/helpers/async-handler.js';
import { UserRole } from '../../../shared/enums/user-role.enum.js';

export const slotRoutes = Router();

slotRoutes.use(authenticate);

slotRoutes.post(
  '/',
  requireRole(UserRole.ADMIN),
  asyncHandler((req, res) => slotController.create(req, res)),
);

slotRoutes.get(
  '/floor/:floorId',
  asyncHandler((req, res) => slotController.listByFloor(req, res)),
);
