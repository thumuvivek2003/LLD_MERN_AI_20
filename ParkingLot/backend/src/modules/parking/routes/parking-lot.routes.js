import { Router } from 'express';
import { parkingLotController } from '../controllers/parking-lot.controller.js';
import { floorController } from '../controllers/floor.controller.js';
import { authenticate } from '../../auth/middlewares/auth.middleware.js';
import { requireRole } from '../../../shared/middlewares/role.middleware.js';
import { asyncHandler } from '../../../shared/helpers/async-handler.js';
import { UserRole } from '../../../shared/enums/user-role.enum.js';

export const parkingLotRoutes = Router();

parkingLotRoutes.use(authenticate);

parkingLotRoutes.post(
  '/',
  requireRole(UserRole.ADMIN),
  asyncHandler((req, res) => parkingLotController.create(req, res)),
);

parkingLotRoutes.get('/', asyncHandler((req, res) => parkingLotController.list(req, res)));

parkingLotRoutes.get('/:id', asyncHandler((req, res) => parkingLotController.get(req, res)));

parkingLotRoutes.post(
  '/:parkingLotId/floors',
  requireRole(UserRole.ADMIN),
  asyncHandler((req, res) => floorController.create(req, res)),
);

parkingLotRoutes.get(
  '/:parkingLotId/floors',
  asyncHandler((req, res) => floorController.list(req, res)),
);
