import { apiClient } from '../../../../shared/services/apiClient.js';

export async function getUsers() {
  return apiClient.get('/admin/users');
}

export async function getUserById(id) {
  return apiClient.get(`/admin/users/${id}`);
}

export async function blockUser(id) {
  return apiClient.patch(`/admin/users/${id}/block`);
}

export async function unblockUser(id) {
  return apiClient.patch(`/admin/users/${id}/unblock`);
}
