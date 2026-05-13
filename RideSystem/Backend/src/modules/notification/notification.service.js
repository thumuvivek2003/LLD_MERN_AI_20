import { notificationSocket } from './notification.socket.js';
import { logger } from '../../core/utils/logger.util.js';

class NotificationService {
  send(userId, channel, payload) {
    logger.info(`[notify -> ${userId}] ${channel}`, payload);
    notificationSocket.toUser(userId, channel, payload);
  }
}

export const notificationService = new NotificationService();
