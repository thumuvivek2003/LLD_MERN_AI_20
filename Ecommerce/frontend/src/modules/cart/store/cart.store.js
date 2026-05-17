import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '../../auth/store/auth.store.js';
import { fetchCart } from '../services/cart.service.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated, role } = useAuthStore();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setCartState = useCallback((next) => setCart(next || null), []);
  const clearCart = useCallback(() => setCart(null), []);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || role !== 'customer') return null;
    setLoading(true);
    setError('');
    try {
      const data = await fetchCart();
      setCart(data.cart || null);
      return data.cart;
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, role]);

  useEffect(() => {
    if (isAuthenticated && role === 'customer') {
      refresh();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, role, refresh]);

  const itemCount =
    cart?.items?.reduce((sum, it) => sum + (it.quantity || 0), 0) || 0;

  const value = {
    cart,
    itemCount,
    loading,
    error,
    setCartState,
    clearCart,
    refresh,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartStore() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartStore must be used inside CartProvider');
  return ctx;
}
