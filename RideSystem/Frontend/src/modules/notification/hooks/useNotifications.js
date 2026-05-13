import { useSocketEvent } from '../../../core/hooks/useSocket.js';
import { notificationService } from '../../../core/services/notification.service.js';

const push = (title, body) => notificationService.push({ title, body });

export function useNotifications() {
  useSocketEvent('ride:driver:assigned', () => push('Driver Assigned', 'A driver has accepted your ride.'));
  useSocketEvent('ride:driver:arriving', () => push('Driver Arriving', 'Your driver is on the way.'));
  useSocketEvent('ride:otp:verified', () => push('Trip Started', 'OTP verified, enjoy your ride.'));
  useSocketEvent('ride:completed', () => push('Trip Completed', 'You have reached your destination.'));
  useSocketEvent('ride:incoming', () => push('New Ride Request', 'Tap to view incoming rides.'));
  useSocketEvent('ride:payment:done', () => push('Payment Successful', 'Payment was completed.'));
}
