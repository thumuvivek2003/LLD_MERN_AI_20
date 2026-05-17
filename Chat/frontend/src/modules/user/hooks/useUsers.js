import { useEffect, useState, useCallback } from 'react';
import { useUserStore } from '../store/user.store.js';
import * as userService from '../services/user.service.js';

/**
 * Load and cache the contacts list in the user store.
 */
export function useUsers({ autoLoad = true } = {}) {
  const users = useUserStore((s) => s.users);
  const setUsers = useUserStore((s) => s.setUsers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.fetchUsers();
      setUsers(data || []);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load users');
      return [];
    } finally {
      setLoading(false);
    }
  }, [setUsers]);

  useEffect(() => {
    if (autoLoad) refresh();
  }, [autoLoad, refresh]);

  return { users, loading, error, refresh };
}
