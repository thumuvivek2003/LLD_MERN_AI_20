import { apiClient } from '../../../core/api/axios.client.js';
import { API } from '../../../core/api/api.endpoints.js';

export const monitoringApi = {
  rides: () => apiClient.get(API.admin.rides),
};
