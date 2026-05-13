import { useEffect, useState } from 'react';
import { rideApi } from '../services/ride.api.js';
import { useSocketEvent } from '../../../core/hooks/useSocket.js';

export function useRideTracking(rideId) {
  const [ride, setRide] = useState(null);
  const [driverPos, setDriverPos] = useState(null);

  const refresh = async () => {
    if (!rideId) return;
    const res = await rideApi.getById(rideId);
    setRide(res.data);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rideId]);

  useSocketEvent('ride:driver:location', (p) => {
    if (p?.rideId === rideId) setDriverPos({ lat: p.lat, lng: p.lng });
  });
  useSocketEvent('ride:driver:assigned', refresh);
  useSocketEvent('ride:driver:arriving', refresh);
  useSocketEvent('ride:otp:verified', refresh);
  useSocketEvent('ride:started', refresh);
  useSocketEvent('ride:completed', refresh);

  return { ride, driverPos, refresh };
}
