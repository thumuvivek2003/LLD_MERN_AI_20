import { apiClient } from '../../../core/api/axios.client.js';
import { API } from '../../../core/api/api.endpoints.js';

export const trackingApi = {
  onlineDrivers: () => apiClient.get(API.drivers.online),
};
