import { socketManager } from '../../core/socket/socket.manager.js';
import { NOTIFICATION_EVENTS } from './notification.events.js';

export const notificationSocket = {
  toUser(userId, event, payload) {
    socketManager.emitToUser(userId, event, payload);
  },
  rideAccepted(userId, payload) {
    socketManager.emitToUser(userId, NOTIFICATION_EVENTS.RIDE_ACCEPTED, payload);
  },
  driverArrived(userId, payload) {
    socketManager.emitToUser(userId, NOTIFICATION_EVENTS.DRIVER_ARRIVED, payload);
  },
  paymentDone(userId, payload) {
    socketManager.emitToUser(userId, NOTIFICATION_EVENTS.PAYMENT_DONE, payload);
  },
};
