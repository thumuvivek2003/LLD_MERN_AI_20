import { apiClient } from '../../../shared/services/apiClient.js';

export async function getOrders() {
  return apiClient.get('/orders');
}

export async function getOrderDetails(id) {
  return apiClient.get(`/orders/${id}`);
}
