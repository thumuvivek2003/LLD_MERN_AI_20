import { apiClient } from '../../../core/api/axios.client.js';
import { API } from '../../../core/api/api.endpoints.js';

export const riderApi = {
  me: () => apiClient.get(API.users.me),
  updateProfile: (data) => apiClient.put(API.users.me, data),
};
