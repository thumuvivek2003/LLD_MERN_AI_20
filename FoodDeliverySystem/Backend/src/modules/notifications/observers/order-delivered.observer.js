import { notificationService } from '../notification.service.js';

export const orderDeliveredObserver = {
  notify({ order, customer }) {
    notificationService.sendOrderNotification(customer, `Order #${order.id} delivered. Enjoy!`);
  },
};
