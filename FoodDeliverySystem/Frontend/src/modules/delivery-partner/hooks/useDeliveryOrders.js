import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/delivery.api.js';

export const useDeliveryOrders = (status) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await api.getMyOrders(status); setOrders(r.data || []); }
    finally { setLoading(false); }
  }, [status]);

  useEffect(() => { load(); }, [load]);
  return { orders, loading, refresh: load };
};
