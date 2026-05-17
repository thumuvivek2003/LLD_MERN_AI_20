import { calculateSubtotal } from '../../../common/utils/price.util.js';

export class BasePriceStep {
  process(context, next) {
    context.summary.subtotal = calculateSubtotal(context.cart.items || []);
    next();
  }
}
