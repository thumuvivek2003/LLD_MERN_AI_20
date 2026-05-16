import { useEffect } from 'react';
import { useAdminDashboardStore } from '../state/adminDashboard.store.js';
import { fetchDashboardMetrics } from '../services/adminNotification.service.js';

export function useAdminDashboard() {
  const { metrics, setMetrics, loading, setLoading, error, setError } =
    useAdminDashboardStore();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchDashboardMetrics()
      .then((data) => !cancelled && setMetrics(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [setMetrics, setLoading, setError]);

  return { metrics, loading, error };
}
