import { Router } from 'express';
import { param } from 'express-validator';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { ROLES } from '../../shared/constants/roles.constant.js';
import * as controller from './admin.controller.js';

export function registerAdminRoutes() {
  const router = Router();
  router.use(authenticate, authorize(ROLES.ADMIN));

  router.get('/stats', controller.getStats);
  router.get('/users', controller.getUsers);
  router.get(
    '/users/:id',
    validate([param('id').isMongoId()]),
    controller.getUserById
  );
  router.patch(
    '/users/:id/block',
    validate([param('id').isMongoId()]),
    controller.blockUser
  );
  router.patch(
    '/users/:id/unblock',
    validate([param('id').isMongoId()]),
    controller.unblockUser
  );
  router.get('/groups', controller.getGroups);

  return router;
}
