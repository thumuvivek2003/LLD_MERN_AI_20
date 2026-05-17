import { useState } from 'react';
import { useCartStore } from '../store/cart.store.js';
import {
  addToCart,
  updateQty,
  removeFromCart,
  applyCouponToCart,
  removeCouponFromCart,
  clearCartItems,
} from '../services/cart.service.js';

export function useCart() {
  const { cart, itemCount, loading, setCartState, refresh, clearCart } = useCartStore();
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  async function run(fn) {
    setActionLoading(true);
    setActionError('');
    try {
      const data = await fn();
      if (data?.cart) setCartState(data.cart);
      return data;
    } catch (e) {
      setActionError(e.message);
      throw e;
    } finally {
      setActionLoading(false);
    }
  }

  return {
    cart,
    itemCount,
    loading,
    actionLoading,
    actionError,
    refresh,
    clearCart,
    addItem: (productId, quantity = 1) => run(() => addToCart(productId, quantity)),
    updateQuantity: (productId, quantity) => run(() => updateQty(productId, quantity)),
    removeItem: (productId) => run(() => removeFromCart(productId)),
    applyCoupon: (code) => run(() => applyCouponToCart(code)),
    removeCoupon: () => run(() => removeCouponFromCart()),
    clearAll: () => run(() => clearCartItems()),
  };
}
