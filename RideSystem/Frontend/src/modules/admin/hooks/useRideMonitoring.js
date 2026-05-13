import { useEffect, useState } from 'react';
import { monitoringApi } from '../services/monitoring.api.js';

export function useRideMonitoring() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const refresh = () => {
    setLoading(true);
    monitoringApi.rides().then((r) => setRides(r.data || [])).finally(() => setLoading(false));
  };
  useEffect(() => { refresh(); }, []);
  return { rides, loading, refresh };
}
