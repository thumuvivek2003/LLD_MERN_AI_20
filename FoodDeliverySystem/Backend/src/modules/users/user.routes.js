import { Router } from 'express';
import { authenticateUser } from '../../core/middlewares/auth.middleware.js';
import { authorizeRoles } from '../../core/middlewares/role.middleware.js';
import { USER_ROLES } from '../../core/constants/roles.constants.js';
import { getUsers, updateUserRole, blockUser, getMe } from './user.controller.js';

export const registerUserRoutes = () => {
  const router = Router();
  router.use(authenticateUser);
  router.get('/me', getMe);

  router.get('/', authorizeRoles(USER_ROLES.SYSTEM_ADMIN), getUsers);
  router.patch('/:id/role', authorizeRoles(USER_ROLES.SYSTEM_ADMIN), updateUserRole);
  router.patch('/:id/block', authorizeRoles(USER_ROLES.SYSTEM_ADMIN), blockUser);
  return router;
};
