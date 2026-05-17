import { ICouponStrategy } from './ICouponStrategy.js';
import { calculateSubtotal } from '../../../common/utils/price.util.js';

export class FlatCouponStrategy extends ICouponStrategy {
  apply(cart, coupon) {
    const subtotal = calculateSubtotal(cart.items);
    const discount = Math.min(Number(coupon.value), subtotal);
    return { discount };
  }
}
