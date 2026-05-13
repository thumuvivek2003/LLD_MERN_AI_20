import { apiClient } from '../../../core/api/axios.client.js';
import { API } from '../../../core/api/api.endpoints.js';

export const adminApi = {
  dashboard: () => apiClient.get(API.admin.dashboard),
  riders: () => apiClient.get(API.admin.riders),
  drivers: () => apiClient.get(API.admin.drivers),
  rides: () => apiClient.get(API.admin.rides),
  setBlocked: (userId, isBlocked) => apiClient.patch(API.admin.block(userId), { isBlocked }),
};
