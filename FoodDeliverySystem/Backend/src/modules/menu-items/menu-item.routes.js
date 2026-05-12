import { Router } from 'express';
import { authenticateUser } from '../../core/middlewares/auth.middleware.js';
import { authorizeRoles } from '../../core/middlewares/role.middleware.js';
import { USER_ROLES } from '../../core/constants/roles.constants.js';
import {
  createMenuItem,
  updateMenuItem,
  toggleAvailability,
  deleteMenuItem,
  getRestaurantMenu,
  getMenuItem,
} from './menu-item.controller.js';

export const registerMenuItemRoutes = () => {
  const router = Router();
  router.get('/by-restaurant/:restaurantId', getRestaurantMenu);
  router.get('/:id', getMenuItem);

  router.use(authenticateUser);
  const adminOnly = authorizeRoles(USER_ROLES.RESTAURANT_ADMIN, USER_ROLES.SYSTEM_ADMIN);
  router.post('/', adminOnly, createMenuItem);
  router.put('/:id', adminOnly, updateMenuItem);
  router.patch('/:id/availability', adminOnly, toggleAvailability);
  router.delete('/:id', adminOnly, deleteMenuItem);
  return router;
};
