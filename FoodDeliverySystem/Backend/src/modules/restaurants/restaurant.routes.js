import { Router } from 'express';
import { authenticateUser } from '../../core/middlewares/auth.middleware.js';
import { authorizeRoles } from '../../core/middlewares/role.middleware.js';
import { USER_ROLES } from '../../core/constants/roles.constants.js';
import {
  createRestaurant,
  updateRestaurant,
  getRestaurants,
  getRestaurant,
  assignRestaurantAdmin,
  getMyRestaurant,
} from './restaurant.controller.js';

export const registerRestaurantRoutes = () => {
  const router = Router();
  router.get('/', getRestaurants);
  router.get('/mine', authenticateUser, authorizeRoles(USER_ROLES.RESTAURANT_ADMIN), getMyRestaurant);
  router.get('/:id', getRestaurant);

  router.use(authenticateUser);
  router.post('/', authorizeRoles(USER_ROLES.SYSTEM_ADMIN), createRestaurant);
  router.put('/:id', authorizeRoles(USER_ROLES.SYSTEM_ADMIN, USER_ROLES.RESTAURANT_ADMIN), updateRestaurant);
  router.patch('/:id/assign-admin', authorizeRoles(USER_ROLES.SYSTEM_ADMIN), assignRestaurantAdmin);
  return router;
};
