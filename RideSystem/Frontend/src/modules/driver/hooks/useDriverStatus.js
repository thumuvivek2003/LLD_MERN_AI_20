import { useEffect, useState } from 'react';
import { driverApi } from '../services/driver.api.js';

export function useDriverStatus() {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const r = await driverApi.me();
      setDriver(r.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const setStatus = async (status) => {
    const r = await driverApi.setStatus(status);
    setDriver(r.data);
  };

  return { driver, loading, refresh, setStatus };
}
