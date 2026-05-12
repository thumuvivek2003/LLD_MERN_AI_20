import { Router } from 'express';
import { authenticateUser } from '../../core/middlewares/auth.middleware.js';
import { authorizeRoles } from '../../core/middlewares/role.middleware.js';
import { USER_ROLES } from '../../core/constants/roles.constants.js';
import {
  getCart,
  addItemToCart,
  removeItemFromCart,
  updateQuantity,
  clearCart,
} from './cart.controller.js';

export const registerCartRoutes = () => {
  const router = Router();
  router.use(authenticateUser, authorizeRoles(USER_ROLES.CUSTOMER));
  router.get('/', getCart);
  router.post('/items', addItemToCart);
  router.patch('/items/:menuItemId', updateQuantity);
  router.delete('/items/:menuItemId', removeItemFromCart);
  router.delete('/', clearCart);
  return router;
};
