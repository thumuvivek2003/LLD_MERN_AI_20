import { useEffect, useState } from 'react';
import { driverApi } from '../services/driver.api.js';
import { useSocketEvent } from '../../../core/hooks/useSocket.js';

export function useIncomingRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const r = await driverApi.pendingRides();
      setRides(r.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  useSocketEvent('ride:incoming', () => refresh());
  useSocketEvent('ride:taken', ({ rideId }) => {
    setRides((rs) => rs.filter((r) => r.id !== rideId && r._id !== rideId));
  });

  return { rides, loading, refresh };
}
