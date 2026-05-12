import { useEffect, useState } from 'react';
import * as api from '../services/admin.api.js';

export const useAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getUsers(), api.getRestaurants()])
      .then(([u, r]) => { setUsers(u.data || []); setRestaurants(r.data || []); })
      .finally(() => setLoading(false));
  }, []);

  return { users, restaurants, loading };
};
