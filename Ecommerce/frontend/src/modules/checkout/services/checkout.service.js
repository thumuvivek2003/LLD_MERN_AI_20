import { apiClient } from '../../../shared/services/apiClient.js';

export async function checkout({ paymentType, address, paymentDetails }) {
  return apiClient.post('/checkout', { paymentType, address, paymentDetails });
}
