import { useState } from 'react';
import { rideApi } from '../services/ride.api.js';

export function useRideBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (payload) => {
    setError(null);
    setLoading(true);
    try {
      const res = await rideApi.request(payload);
      return res.data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error };
}
