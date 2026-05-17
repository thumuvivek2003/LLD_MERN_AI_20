import { cartService } from '../cart/cart.service.js';
import { inventoryService } from '../inventory/InventoryService.js';
import { pricingService } from '../pricing/PricingService.js';
import { paymentService } from '../payment/payment.service.js';
import { orderService } from '../order/order.service.js';
import { ORDER_STATUS } from '../../common/constants/orderStatus.constants.js';
import { PAYMENT_STATUS } from '../../common/constants/paymentType.constants.js';
import { ValidationError } from '../../common/errors/ValidationError.js';

/**
 * Facade orchestrator: coordinates cart -> inventory -> pricing -> payment -> order -> clear cart.
 * Each collaborator stays single-responsibility; this class owns the workflow.
 */
export class CheckoutService {
  async checkout(userId, paymentType, address, paymentDetails = {}) {
    if (!paymentType) throw new ValidationError('paymentType is required');
    if (!address?.line1 || !address?.city || !address?.pincode) {
      throw new ValidationError('address.line1, address.city, address.pincode are required');
    }

    // 1. Load and validate cart
    const cart = await cartService.getCart(userId);
    if (!cart.items.length) throw new ValidationError('Cart is empty', 'CART_EMPTY');

    // 2. Inventory check
    await inventoryService.validateStock(cart.items);

    // 3. Re-calculate pricing
    const pricing = pricingService.calculate({ items: cart.items, appliedCoupon: cart.appliedCoupon });

    // 4 + 5. Payment via Strategy (factory inside service)
    const paymentResult = await paymentService.processPayment(paymentType, pricing.total, paymentDetails);

    // 6. Build order via Builder
    const initialStatus =
      paymentResult.status === PAYMENT_STATUS.SUCCESS ? ORDER_STATUS.PAID : ORDER_STATUS.CREATED;
    const orderPayload = orderService
      .builder()
      .setUser(userId)
      .setItems(cart.items)
      .setPricing(pricing)
      .setPayment({
        type: paymentType,
        status: paymentResult.status,
        transactionId: paymentResult.transactionId,
      })
      .setAddress(address)
      .setStatus(initialStatus)
      .build();

    // 7. Persist order
    const order = await orderService.createOrder(orderPayload);

    // 8. Reserve stock + clear cart only on payment success
    if (paymentResult.status === PAYMENT_STATUS.SUCCESS) {
      await inventoryService.reserveStock(cart.items);
      await cartService.clearCart(userId);
    } else {
      // 9. Surface a clear payment-failed error to the client (still persist the failed order)
      throw new ValidationError('Payment failed', 'PAYMENT_FAILED');
    }

    return { order, payment: paymentResult };
  }
}

export const checkoutService = new CheckoutService();
