import { createContext, useContext, useState, useCallback } from 'react';
import * as cartApi from '../../modules/customer/services/customer.api.js';
import { useAuthContext } from './AuthContext.jsx';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthed } = useAuthContext();
  const [cart, setCart] = useState({ items: [], restaurantId: null, total: 0 });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthed) return;
    setLoading(true);
    try {
      const r = await cartApi.getCart();
      setCart(r.data);
    } finally { setLoading(false); }
  }, [isAuthed]);

  const addToCart = useCallback(async (menuItemId, quantity = 1) => {
    const r = await cartApi.addItem({ menuItemId, quantity });
    setCart(r.data);
  }, []);

  const removeFromCart = useCallback(async (menuItemId) => {
    const r = await cartApi.removeItem(menuItemId);
    setCart(r.data);
  }, []);

  const updateQuantity = useCallback(async (menuItemId, quantity) => {
    const r = await cartApi.updateQuantity(menuItemId, quantity);
    setCart(r.data);
  }, []);

  const clearCart = useCallback(async () => {
    const r = await cartApi.clearCart();
    setCart(r.data);
  }, []);

  return (
    <CartContext.Provider value={{ cart, loading, refresh, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used inside CartProvider');
  return ctx;
};
