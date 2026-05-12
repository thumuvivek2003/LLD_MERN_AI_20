import { Router } from 'express';
import { authenticateUser } from '../../core/middlewares/auth.middleware.js';
import { authorizeRoles } from '../../core/middlewares/role.middleware.js';
import { USER_ROLES } from '../../core/constants/roles.constants.js';
import {
  getProfile,
  setAvailability,
  acceptDelivery,
  rejectDelivery,
  verifyDeliveryOtp,
  getMyOrders,
  listAllPartners,
} from './delivery.controller.js';

export const registerDeliveryRoutes = () => {
  const router = Router();
  router.use(authenticateUser);

  router.get('/partners', authorizeRoles(USER_ROLES.SYSTEM_ADMIN, USER_ROLES.RESTAURANT_ADMIN), listAllPartners);

  const partnerOnly = authorizeRoles(USER_ROLES.DELIVERY_PARTNER);
  router.get('/me', partnerOnly, getProfile);
  router.patch('/me/availability', partnerOnly, setAvailability);
  router.get('/me/orders', partnerOnly, getMyOrders);
  router.post('/orders/:orderId/accept', partnerOnly, acceptDelivery);
  router.post('/orders/:orderId/reject', partnerOnly, rejectDelivery);
  router.post('/orders/:orderId/verify-otp', partnerOnly, verifyDeliveryOtp);

  return router;
};
