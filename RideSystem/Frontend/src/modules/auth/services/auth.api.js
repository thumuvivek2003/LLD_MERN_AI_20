import { apiClient } from '../../../core/api/axios.client.js';
import { API } from '../../../core/api/api.endpoints.js';

export const authApi = {
  login: (payload) => apiClient.post(API.auth.login, payload),
  register: (payload) => apiClient.post(API.auth.register, payload),
};
