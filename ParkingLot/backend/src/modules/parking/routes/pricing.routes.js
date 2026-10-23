import { Router } from 'express';
import { pricingController } from '../controllers/pricing.controller.js';
import { authenticate } from '../../auth/middlewares/auth.middleware.js';
import { requireRole } from '../../../shared/middlewares/role.middleware.js';
import { asyncHandler } from '../../../shared/helpers/async-handler.js';
import { UserRole } from '../../../shared/enums/user-role.enum.js';

export const pricingRoutes = Router();

pricingRoutes.use(authenticate);

pricingRoutes.get('/', asyncHandler((req, res) => pricingController.list(req, res)));

pricingRoutes.patch(
  '/lots/:parkingLotId',
  requireRole(UserRole.ADMIN),
  asyncHandler((req, res) => pricingController.assign(req, res)),
);
