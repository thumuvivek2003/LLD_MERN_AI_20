import axios from 'axios';
import { loadEnvironmentConfig } from './env.js';

export function createAxiosClient() {
  const { apiUrl } = loadEnvironmentConfig();
  const instance = axios.create({
    baseURL: apiUrl,
    timeout: 8000,
    headers: { 'Content-Type': 'application/json' },
  });
  instance.interceptors.response.use(
    (r) => r,
    (err) => {
      console.error('[api]', err?.response?.status, err?.message);
      return Promise.reject(err);
    }
  );
  return instance;
}

export const apiClient = createAxiosClient();
