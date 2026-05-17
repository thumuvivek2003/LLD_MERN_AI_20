import { apiClient } from '../../../../shared/services/apiClient.js';

export async function getAdminCoupons() {
  return apiClient.get('/admin/coupons');
}

export async function getCouponById(id) {
  return apiClient.get(`/admin/coupons/${id}`);
}

export async function createCoupon(payload) {
  return apiClient.post('/admin/coupons', payload);
}

export async function updateCoupon(id, payload) {
  return apiClient.put(`/admin/coupons/${id}`, payload);
}

export async function deleteCoupon(id) {
  return apiClient.delete(`/admin/coupons/${id}`);
}

export async function toggleCoupon(id) {
  return apiClient.patch(`/admin/coupons/${id}/toggle`);
}

export async function assignCoupon(id, userId) {
  return apiClient.post(`/admin/coupons/${id}/assign`, { userId });
}

export async function unassignCouponFromUser(id, userId) {
  return apiClient.delete(`/admin/coupons/${id}/assign/${userId}`);
}
