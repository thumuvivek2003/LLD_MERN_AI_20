import { useCallback, useEffect, useState } from 'react';
import { useAdminStore } from '../store/admin.store.js';
import * as adminService from '../services/admin.service.js';

/**
 * Convenience hook for admin pages — exposes loaders and block/unblock
 * mutations, and routes results into the admin store.
 */
export function useAdmin({ autoLoad = false } = {}) {
  const stats = useAdminStore((s) => s.stats);
  const users = useAdminStore((s) => s.users);
  const groups = useAdminStore((s) => s.groups);
  const setStats = useAdminStore((s) => s.setStats);
  const setUsers = useAdminStore((s) => s.setUsers);
  const setGroups = useAdminStore((s) => s.setGroups);
  const patchUser = useAdminStore((s) => s.patchUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.fetchStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, [setStats]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.fetchUsers();
      setUsers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [setUsers]);

  const loadGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.fetchGroups();
      setGroups(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  }, [setGroups]);

  const block = useCallback(
    async (id) => {
      const updated = await adminService.blockUser(id);
      if (updated) patchUser(updated);
      return updated;
    },
    [patchUser]
  );

  const unblock = useCallback(
    async (id) => {
      const updated = await adminService.unblockUser(id);
      if (updated) patchUser(updated);
      return updated;
    },
    [patchUser]
  );

  useEffect(() => {
    if (autoLoad) {
      loadStats();
      loadUsers();
      loadGroups();
    }
  }, [autoLoad, loadStats, loadUsers, loadGroups]);

  return {
    stats,
    users,
    groups,
    loading,
    error,
    loadStats,
    loadUsers,
    loadGroups,
    block,
    unblock,
  };
}
