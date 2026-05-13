import { useEffect } from 'react';
import { locationService } from '../../../core/services/location.service.js';
import { driverTrackingApi } from '../services/driver-tracking.api.js';
import { driverApi } from '../services/driver.api.js';

export function useDriverTracking({ rideId, riderId, driverId } = {}) {
  useEffect(() => {
    const stop = locationService.watch((pos) => {
      driverApi.updateLocation(pos).catch(() => {});
      if (rideId && riderId) driverTrackingApi.emitLocation({ ...pos, rideId, riderId, driverId });
    });
    return stop;
  }, [rideId, riderId, driverId]);
}
