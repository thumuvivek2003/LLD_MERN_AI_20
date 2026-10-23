import { Router } from 'express';
import { entryController } from '../controllers/entry.controller.js';
import { authenticate } from '../../auth/middlewares/auth.middleware.js';
import { requireRole } from '../../../shared/middlewares/role.middleware.js';
import { asyncHandler } from '../../../shared/helpers/async-handler.js';
import { UserRole } from '../../../shared/enums/user-role.enum.js';

export const entryRoutes = Router();

entryRoutes.use(authenticate);

entryRoutes.post(
  '/',
  requireRole(UserRole.ENTRY_WATCHMAN, UserRole.ADMIN),
  asyncHandler((req, res) => entryController.enter(req, res)),
);
