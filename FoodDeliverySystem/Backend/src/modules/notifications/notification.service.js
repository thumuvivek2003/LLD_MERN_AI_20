import { createLogger } from '../../config/logger.config.js';

const logger = createLogger();

class NotificationService {
  sendOtpNotification(user, otp) {
    logger.info(`[NOTIFY] OTP for ${user?.email || user?.id}: ${otp}`);
  }

  sendOrderNotification(user, message) {
    logger.info(`[NOTIFY] Order update -> ${user?.email || user?.id}: ${message}`);
  }
}

export const notificationService = new NotificationService();
