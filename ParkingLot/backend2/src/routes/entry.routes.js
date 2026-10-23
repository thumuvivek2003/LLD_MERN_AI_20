import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { entryValidator } from '../validators/entry.validator.js';
import { UserRole } from '../enums/UserRole.js';

export const entryRoutes = (controller) => {
  const router = Router();
  router.post(
    '/',
    authMiddleware,
    requireRole(UserRole.ADMIN, UserRole.ATTENDANT),
    validate(entryValidator),
    controller.park
  );
  return router;
};
