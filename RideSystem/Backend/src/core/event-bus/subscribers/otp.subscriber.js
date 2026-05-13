import { eventBus } from '../eventBus.js';
import { logger } from '../../utils/logger.util.js';

export function registerOtpSubscriber() {
  // For MVP: rider already sees OTP via API; this is a placeholder hook.
  eventBus.on('ride.accepted', (p) => {
    logger.info('[otp] ride accepted; OTP generated', { rideId: p.rideId });
  });
}
