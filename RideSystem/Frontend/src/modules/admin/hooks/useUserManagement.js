import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../services/admin.api.js';

export function useUserManagement(kind = 'riders') {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetcher = kind === 'drivers' ? adminApi.drivers : adminApi.riders;

  const refresh = useCallback(() => {
    setLoading(true);
    fetcher().then((r) => setUsers(r.data || [])).finally(() => setLoading(false));
  }, [fetcher]);

  useEffect(() => { refresh(); }, [refresh]);

  const toggleBlock = async (u) => {
    await adminApi.setBlocked(u.id, !u.isBlocked);
    refresh();
  };

  return { users, loading, toggleBlock, refresh };
}
