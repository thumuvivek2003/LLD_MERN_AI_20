import { apiClient } from '../../../core/api/axios.client.js';
import { API } from '../../../core/api/api.endpoints.js';

export const earningsApi = {
  summary: () => apiClient.get(API.payments.driverEarnings),
};
