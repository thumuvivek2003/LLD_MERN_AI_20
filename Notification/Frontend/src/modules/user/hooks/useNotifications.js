import { useEffect } from 'react';
import { useUserNotificationStore } from '../state/userNotification.store.js';
import { fetchNotifications } from '../services/userNotification.service.js';
import { useCurrentActorStore } from '../../../shared/state/currentActor.store.js';

export function useNotifications() {
  const userId = useCurrentActorStore((s) => s.userId);
  const {
    notifications,
    loading,
    error,
    setNotifications,
    setLoading,
    setError,
  } = useUserNotificationStore();

  useEffect(() => {
    let cancelled = false;
    if (!userId) return;
    setLoading(true);
    setError(null);
    fetchNotifications(userId)
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
  }, [userId, setNotifications, setLoading, setError]);

  return { notifications, loading, error };
}
