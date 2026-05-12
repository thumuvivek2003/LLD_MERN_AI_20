import { createContext, useContext, useState, useCallback } from 'react';
import { placeOrder, getMyOrders, getOrderById } from '../../modules/customer/services/customer.api.js';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMyOrders = useCallback(async () => {
    setLoading(true);
    try {
      const r = await getMyOrders();
      setOrders(r.data || []);
    } finally { setLoading(false); }
  }, []);

  const placeNewOrder = useCallback(async (payload) => {
    const r = await placeOrder(payload);
    return r.data;
  }, []);

  const fetchOrder = useCallback(async (id) => {
    const r = await getOrderById(id);
    return r.data;
  }, []);

  return (
    <OrderContext.Provider value={{ orders, loading, loadMyOrders, placeNewOrder, fetchOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrderContext must be used inside OrderProvider');
  return ctx;
};
