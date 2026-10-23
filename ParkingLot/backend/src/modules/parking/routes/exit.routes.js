import { Router } from 'express';
import { exitController } from '../controllers/exit.controller.js';
import { authenticate } from '../../auth/middlewares/auth.middleware.js';
import { requireRole } from '../../../shared/middlewares/role.middleware.js';
import { asyncHandler } from '../../../shared/helpers/async-handler.js';
import { UserRole } from '../../../shared/enums/user-role.enum.js';

export const exitRoutes = Router();

exitRoutes.use(authenticate, requireRole(UserRole.EXIT_WATCHMAN, UserRole.ADMIN));

exitRoutes.get('/tickets/:code', asyncHandler((req, res) => exitController.search(req, res)));

exitRoutes.get('/tickets/:code/quote', asyncHandler((req, res) => exitController.quote(req, res)));

exitRoutes.post('/tickets/:code/pay', asyncHandler((req, res) => exitController.pay(req, res)));

exitRoutes.post('/tickets/:code/close', asyncHandler((req, res) => exitController.close(req, res)));
