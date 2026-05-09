import { useState } from 'react';
import api from '../../shared/api/axios.js';
import { ENDPOINTS } from '../../shared/api/apiEndpoints.js';
import { useBookingStore } from '../bookings/booking.store.js';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setPaymentId = useBookingStore(s => s.setPaymentId);

  const processPayment = async ({ method, details, amount, onSuccess }) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post(ENDPOINTS.payments.process, { amount, method, details });
      setPaymentId(res.data._id);
      onSuccess?.(res.data);
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, processPayment };
};
