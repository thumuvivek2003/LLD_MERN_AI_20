import { apiClient } from '../../../config/axios.js';

export async function fetchDashboardSnapshot() {
  const { data } = await apiClient.get('/elevator/snapshot');
  return data;
}
