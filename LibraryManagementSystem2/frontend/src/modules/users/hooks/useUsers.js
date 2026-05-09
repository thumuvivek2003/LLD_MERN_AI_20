import { useState, useEffect, useCallback } from 'react';
import { getUsers } from '../services/userService.js';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(() => {
    setLoading(true);
    getUsers()
      .then(({ data }) => setUsers(data.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { users, loading, refetch: fetch };
}
