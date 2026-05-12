import { notificationService } from '../notification.service.js';

export const otpGeneratedObserver = {
  notify({ user, otp }) {
    notificationService.sendOtpNotification(user, otp);
  },
};
