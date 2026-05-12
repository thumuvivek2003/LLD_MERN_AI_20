import { useEffect, useState, useCallback } from 'react';
import * as api from '../services/restaurant-admin.api.js';

export const useRestaurantOrders = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadRestaurant = useCallback(async () => {
    const r = await api.getMyRestaurant();
    setRestaurant(r.data);
    return r.data;
  }, []);

  const loadOrders = useCallback(async (status) => {
    setLoading(true);
    try {
      const r = restaurant || (await loadRestaurant());
      if (!r) { setOrders([]); return; }
      const res = await api.getIncomingOrders(r.id, status);
      setOrders(res.data || []);
    } finally { setLoading(false); }
  }, [restaurant, loadRestaurant]);

  useEffect(() => { loadRestaurant(); }, [loadRestaurant]);

  return { restaurant, orders, loading, loadOrders, loadRestaurant };
};
