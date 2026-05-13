import { apiClient } from '../../../core/api/axios.client.js';
import { API } from '../../../core/api/api.endpoints.js';

export const analyticsApi = {
  dashboard: () => apiClient.get(API.admin.dashboard),
};
