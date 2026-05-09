import { useState, useEffect, useCallback } from 'react';
import { getBorrowHistory } from '../services/borrowService.js';
import { useAuthStore } from '../../../app/store/authStore.js';

export function useBorrowRequests() {
  const user = useAuthStore((s) => s.user);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(() => {
    if (!user) return;
    setLoading(true);
    getBorrowHistory(user._id)
      .then(({ data }) => setRequests(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  return { requests, loading, refetch: fetch };
}
