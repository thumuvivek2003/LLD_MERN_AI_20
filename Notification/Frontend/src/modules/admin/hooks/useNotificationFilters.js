import { useEffect } from 'react';
import { useAdminDashboardStore } from '../state/adminDashboard.store.js';
import { fetchNotifications } from '../services/adminNotification.service.js';

export function useNotificationFilters() {
  const {
    filters,
    setFilters,
    resetFilters,
    notifications,
    setNotifications,
    loading,
    setLoading,
    error,
    setError,
  } = useAdminDashboardStore();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchNotifications(filters)
      .then((data) => {
        if (cancelled) return;
        const items = Array.isArray(data) ? data : data?.items || [];
        setNotifications(items);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [filters, setNotifications, setLoading, setError]);

  return { notifications, filters, setFilters, resetFilters, loading, error };
}
