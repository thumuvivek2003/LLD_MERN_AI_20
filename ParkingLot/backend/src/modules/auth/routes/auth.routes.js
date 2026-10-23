import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireRole } from '../../../shared/middlewares/role.middleware.js';
import { asyncHandler } from '../../../shared/helpers/async-handler.js';
import { UserRole } from '../../../shared/enums/user-role.enum.js';

export const authRoutes = Router();

authRoutes.post('/login', asyncHandler((req, res) => authController.login(req, res)));

authRoutes.post(
  '/users',
  authenticate,
  requireRole(UserRole.ADMIN),
  asyncHandler((req, res) => authController.createUser(req, res)),
);

authRoutes.patch(
  '/users/:userId/assign-lot',
  authenticate,
  requireRole(UserRole.ADMIN),
  asyncHandler((req, res) => authController.assignToLot(req, res)),
);

authRoutes.get(
  '/users',
  authenticate,
  requireRole(UserRole.ADMIN),
  asyncHandler((req, res) => authController.list(req, res)),
);
