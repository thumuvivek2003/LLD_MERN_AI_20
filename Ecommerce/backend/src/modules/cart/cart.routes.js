import { Router } from 'express';
import { verifyAuth, requireRole } from '../../common/middlewares/auth.middleware.js';
import {
  getCart,
  addItem,
  updateQty,
  removeItem,
  applyCoupon,
  removeCoupon,
  clearCart,
} from './cart.controller.js';

const router = Router();

router.use(verifyAuth, requireRole('customer'));

router.get('/', getCart);
router.post('/items', addItem);
router.patch('/items/:productId', updateQty);
router.delete('/items/:productId', removeItem);
router.post('/coupon', applyCoupon);
router.delete('/coupon', removeCoupon);
router.delete('/', clearCart);

export default router;
