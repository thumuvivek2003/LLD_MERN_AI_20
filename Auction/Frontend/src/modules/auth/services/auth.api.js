import { apiClient } from '../../shared/services/apiClient.js';

export const authApi = {
  login: (payload) => apiClient.post('/api/auth/login', payload),
  register: (payload) => apiClient.post('/api/auth/register', payload),
  me: () => apiClient.get('/api/auth/me', { silent: true }),
};

export const login = authApi.login;
export const register = authApi.register;
