import { eventBus } from '../eventBus.js';
import { socketManager } from '../../socket/socket.manager.js';
import { SOCKET_EVENTS } from '../../socket/socket.events.js';

export function registerSocketSubscriber() {
  eventBus.on('ride.created', (p) => {
    // Broadcast to all online drivers; client decides via filters
    socketManager.emitToRole('DRIVER', SOCKET_EVENTS.RIDE_INCOMING, p);
  });

  eventBus.on('ride.accepted', (p) => {
    socketManager.emitToUser(p.riderId, SOCKET_EVENTS.RIDE_DRIVER_ASSIGNED, p);
    socketManager.emitToRole('DRIVER', SOCKET_EVENTS.RIDE_TAKEN, { rideId: p.rideId });
  });

  eventBus.on('ride.arriving', (p) => {
    socketManager.emitToUser(p.riderId, SOCKET_EVENTS.RIDE_DRIVER_ARRIVING, p);
  });

  eventBus.on('ride.otp.verified', (p) => {
    socketManager.emitToUser(p.riderId, SOCKET_EVENTS.RIDE_OTP_VERIFIED, p);
  });

  eventBus.on('ride.started', (p) => {
    socketManager.emitToUser(p.riderId, SOCKET_EVENTS.RIDE_STARTED, p);
  });

  eventBus.on('ride.completed', (p) => {
    socketManager.emitToUser(p.riderId, SOCKET_EVENTS.RIDE_COMPLETED, p);
  });

  eventBus.on('ride.cancelled', (p) => {
    if (p.riderId) socketManager.emitToUser(p.riderId, SOCKET_EVENTS.RIDE_CANCELLED, p);
    if (p.driverId) socketManager.emitToUser(p.driverId, SOCKET_EVENTS.RIDE_CANCELLED, p);
  });

  eventBus.on('payment.completed', (p) => {
    if (p.riderId) socketManager.emitToUser(p.riderId, SOCKET_EVENTS.RIDE_PAYMENT_DONE, p);
    if (p.driverId) socketManager.emitToUser(p.driverId, SOCKET_EVENTS.RIDE_PAYMENT_DONE, p);
  });
}
