import { eventBus } from '../eventBus.js';
import { logger } from '../../utils/logger.util.js';

export function registerNotificationSubscriber() {
  eventBus.on('ride.created', (p) => logger.info('[notify] ride created', { rideId: p.rideId }));
  eventBus.on('ride.accepted', (p) => logger.info('[notify] ride accepted', { rideId: p.rideId, driverId: p.driverId }));
  eventBus.on('ride.completed', (p) => logger.info('[notify] ride completed', { rideId: p.rideId }));
  eventBus.on('payment.completed', (p) => logger.info('[notify] payment completed', { rideId: p.rideId }));
}
