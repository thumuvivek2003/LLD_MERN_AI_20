import { eventBus, EVENTS } from './event-bus.js';
import { orderCreatedObserver } from './observers/order-created.observer.js';
import { orderDeliveredObserver } from './observers/order-delivered.observer.js';
import { paymentSuccessObserver } from './observers/payment-success.observer.js';
import { otpGeneratedObserver } from './observers/otp-generated.observer.js';

let wired = false;
export const wireNotificationObservers = () => {
  if (wired) return;
  eventBus.subscribe(EVENTS.ORDER_CREATED, orderCreatedObserver);
  eventBus.subscribe(EVENTS.ORDER_DELIVERED, orderDeliveredObserver);
  eventBus.subscribe(EVENTS.PAYMENT_SUCCESS, paymentSuccessObserver);
  eventBus.subscribe(EVENTS.OTP_GENERATED, otpGeneratedObserver);
  wired = true;
};

wireNotificationObservers();
