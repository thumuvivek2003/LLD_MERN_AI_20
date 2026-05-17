import { apiClient } from '../../../../shared/services/apiClient.js';

export async function getAdminStats() {
  return apiClient.get('/admin/stats');
}
