import { SOCKET_EVENTS } from './socket.events.js';
import { logger } from '../utils/logger.util.js';
import { eventBus } from '../event-bus/eventBus.js';
import { ROLES } from '../../config/constants.js';

export function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on(SOCKET_EVENTS.JOIN, ({ userId, role }) => {
      if (userId) socket.join(`user:${userId}`);
      if (role) socket.join(`role:${role}`);
    });

    socket.on(SOCKET_EVENTS.DRIVER_LOCATION_UPDATE, (payload) => {
      // payload: { driverId, rideId?, lat, lng }
      eventBus.emit('driver.location.updated', payload);
      if (payload?.rideId && payload?.riderId) {
        io.to(`user:${payload.riderId}`).emit(SOCKET_EVENTS.RIDE_DRIVER_LOCATION, payload);
      }
    });

    socket.on(SOCKET_EVENTS.DRIVER_GO_ONLINE, ({ driverId }) => {
      eventBus.emit('driver.status.online', { driverId });
    });

    socket.on(SOCKET_EVENTS.DRIVER_GO_OFFLINE, ({ driverId }) => {
      eventBus.emit('driver.status.offline', { driverId });
    });

    socket.on('disconnect', () => logger.info(`Socket disconnected: ${socket.id}`));
  });
}
