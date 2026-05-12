import { Router } from 'express';
import { authenticateUser } from '../../core/middlewares/auth.middleware.js';
import { authorizeRoles } from '../../core/middlewares/role.middleware.js';
import { USER_ROLES } from '../../core/constants/roles.constants.js';
import {
  placeOrder,
  getOrderDetails,
  updateOrderStatus,
  getOrderHistory,
  getRestaurantOrders,
  assignDelivery,
} from './order.controller.js';

export const registerOrderRoutes = () => {
  const router = Router();
  router.use(authenticateUser);

  router.post('/', authorizeRoles(USER_ROLES.CUSTOMER), placeOrder);
  router.get('/me', authorizeRoles(USER_ROLES.CUSTOMER), getOrderHistory);
  router.get('/by-restaurant/:restaurantId',
    authorizeRoles(USER_ROLES.RESTAURANT_ADMIN, USER_ROLES.SYSTEM_ADMIN),
    getRestaurantOrders);
  router.get('/:id', getOrderDetails);
  router.patch('/:id/status', updateOrderStatus);
  router.patch('/:id/assign',
    authorizeRoles(USER_ROLES.RESTAURANT_ADMIN, USER_ROLES.SYSTEM_ADMIN),
    assignDelivery);

  return router;
};
