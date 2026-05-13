import { useEffect, useState } from 'react';
import { rideApi } from '../services/ride.api.js';

export function useRideHistory() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    rideApi.myHistory()
      .then((r) => setRides(r.data || []))
      .finally(() => setLoading(false));
  }, []);

  return { rides, loading };
}
