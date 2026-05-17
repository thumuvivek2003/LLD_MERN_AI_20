import { PricingPipeline } from './pipeline/PricingPipeline.js';
import { BasePriceStep } from './pipeline/BasePriceStep.js';
import { CouponStep } from './pipeline/CouponStep.js';
import { DeliveryFeeStep } from './pipeline/DeliveryFeeStep.js';
import { PlatformFeeStep } from './pipeline/PlatformFeeStep.js';

export class PricingService {
  constructor() {
    this.pipeline = new PricingPipeline([
      new BasePriceStep(),
      new CouponStep(),
      new DeliveryFeeStep(),
      new PlatformFeeStep(),
    ]);
  }

  calculate(cart) {
    const context = {
      cart: cart || { items: [] },
      coupon: cart?.appliedCoupon || null,
      summary: { subtotal: 0, discount: 0, deliveryFee: 0, platformFee: 0, total: 0 },
      freeShipping: false,
    };
    this.pipeline.execute(context);
    return context.summary;
  }
}

export const pricingService = new PricingService();
