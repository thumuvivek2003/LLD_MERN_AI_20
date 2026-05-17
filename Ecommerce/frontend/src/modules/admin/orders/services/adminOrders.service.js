import { apiClient } from '../../../../shared/services/apiClient.js';

export async function getAllOrders() {
  return apiClient.get('/admin/orders');
}

export async function getOrderById(id) {
  return apiClient.get(`/admin/orders/${id}`);
}

export async function updateOrderStatus(id, status) {
  return apiClient.patch(`/admin/orders/${id}/status`, { status });
}
