import { Router } from 'express';
import { verifyAuth, requireRole } from '../../common/middlewares/auth.middleware.js';
import {
  getStats,
  listUsers,
  getUserDetails,
  blockUser,
  unblockUser,
  listCoupons,
  getCouponDetails,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCoupon,
  assignCoupon,
  unassignCoupon,
  listOrders,
  getOrderDetails,
  updateOrderStatus,
} from './admin.controller.js';

const router = Router();

router.use(verifyAuth, requireRole('admin'));

router.get('/stats', getStats);

router.get('/users', listUsers);
router.get('/users/:id', getUserDetails);
router.patch('/users/:id/block', blockUser);
router.patch('/users/:id/unblock', unblockUser);

router.get('/coupons', listCoupons);
router.post('/coupons', createCoupon);
router.get('/coupons/:id', getCouponDetails);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);
router.patch('/coupons/:id/toggle', toggleCoupon);
router.post('/coupons/:id/assign', assignCoupon);
router.delete('/coupons/:id/assign/:userId', unassignCoupon);

router.get('/orders', listOrders);
router.get('/orders/:id', getOrderDetails);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;
