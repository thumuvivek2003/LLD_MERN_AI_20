import { notificationService } from '../notification.service.js';

export const orderCreatedObserver = {
  notify({ order, customer }) {
    notificationService.sendOrderNotification(customer, `Order #${order.id} placed successfully`);
  },
};
