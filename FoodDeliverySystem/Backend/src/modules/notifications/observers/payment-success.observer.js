import { notificationService } from '../notification.service.js';

export const paymentSuccessObserver = {
  notify({ order, customer, method }) {
    notificationService.sendOrderNotification(customer, `Payment via ${method} succeeded for order #${order.id}`);
  },
};
