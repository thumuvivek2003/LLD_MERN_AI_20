import { useCallback, useEffect, useState } from 'react';
import { getCoupons } from '../services/coupon.service.js';
import { useCart } from '../../cart/hooks/useCart.js';

export function useCoupon() {
  const { applyCoupon, removeCoupon, actionLoading, actionError } = useCart();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCoupons();
      setCoupons(data.coupons || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return {
    coupons,
    loading,
    error,
    applyCoupon,
    removeCoupon,
    applying: actionLoading,
    applyError: actionError,
    refresh: fetchCoupons,
  };
}
