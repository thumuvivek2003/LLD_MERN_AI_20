export class DeliveryFeeStep {
  process(context, next) {
    if (context.freeShipping || context.summary.subtotal > 999) {
      context.summary.deliveryFee = 0;
    } else if ((context.cart.items || []).length === 0) {
      context.summary.deliveryFee = 0;
    } else {
      context.summary.deliveryFee = 40;
    }
    next();
  }
}
