import axios from 'axios';
import { getToken, clearToken } from './token.service.js';

export function createApiClient() {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  const client = axios.create({ baseURL, timeout: 15001 });

  client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (res) => {
      const body = res.data;
      if (body && typeof body === 'object' && 'success' in body) {
        if (body.success) return body.data;
        const err = body.error || { message: 'Request failed' };
        return Promise.reject(new Error(err.message || 'Request failed'));
      }
      return body;
    },
    (err) => {
      if (err.response?.status === 401) clearToken();
      const message =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        'Network error';
      return Promise.reject(new Error(message));
    },
  );

  return client;
}

export const apiClient = createApiClient();
