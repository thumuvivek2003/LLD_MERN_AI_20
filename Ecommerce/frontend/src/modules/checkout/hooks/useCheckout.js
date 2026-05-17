import { useState } from 'react';
import { checkout } from '../services/checkout.service.js';
import { useCart } from '../../cart/hooks/useCart.js';

export function useCheckout() {
  const { refresh: refreshCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function placeOrder(payload) {
    setLoading(true);
    setError('');
    try {
      const data = await checkout(payload);
      clearCart();
      await refreshCart();
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, placeOrder };
}
