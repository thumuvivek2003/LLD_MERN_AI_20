import { driverService } from './driver.service.js';
import { socketManager } from '../../core/socket/socket.manager.js';
import { SOCKET_EVENTS } from '../../core/socket/socket.events.js';

class DriverLocationService {
  async update(userId, location, rideId = null, riderId = null) {
    await driverService.updateLocation(userId, location);
    if (rideId && riderId) {
      socketManager.emitToUser(riderId, SOCKET_EVENTS.RIDE_DRIVER_LOCATION, {
        rideId,
        driverId: userId,
        ...location,
      });
    }
  }
}

export const driverLocationService = new DriverLocationService();
