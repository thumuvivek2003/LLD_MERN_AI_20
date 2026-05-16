import { useCallback, useEffect } from 'react';
import { useUserNotificationStore } from '../state/userNotification.store.js';
import {
  fetchPreferences,
  updatePreferences,
} from '../services/userNotification.service.js';
import { useCurrentActorStore } from '../../../shared/state/currentActor.store.js';

export function useNotificationPreferences() {
  const userId = useCurrentActorStore((s) => s.userId);
  const { preferences, setPreferences, setError, setLoading, loading, error } =
    useUserNotificationStore();

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoading(true);
    fetchPreferences(userId)
      .then((data) => !cancelled && setPreferences(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [userId, setPreferences, setError, setLoading]);

  const update = useCallback(
    async (patch) => {
      if (!userId) return;
      const next = { ...(preferences || {}), ...patch };
      setPreferences(next); // optimistic
      try {
        const fresh = await updatePreferences(userId, next);
        setPreferences(fresh);
      } catch (err) {
        setError(err.message);
      }
    },
    [userId, preferences, setPreferences, setError],
  );

  return { preferences, update, loading, error };
}
