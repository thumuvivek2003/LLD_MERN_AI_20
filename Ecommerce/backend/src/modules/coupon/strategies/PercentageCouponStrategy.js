import { ICouponStrategy } from './ICouponStrategy.js';
import { calculateSubtotal } from '../../../common/utils/price.util.js';

export class PercentageCouponStrategy extends ICouponStrategy {
  apply(cart, coupon) {
    const subtotal = calculateSubtotal(cart.items);
    const discount = Math.round((subtotal * Number(coupon.value)) / 100);
    return { discount: Math.min(discount, subtotal) };
  }
}
