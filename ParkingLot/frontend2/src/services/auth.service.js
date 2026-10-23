import { apiClient } from './apiClient.js';

export const authService = {
  login: async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  },
  register: async (payload) => {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  },
};
