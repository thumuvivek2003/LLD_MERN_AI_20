import { storageService } from '../services/storage.service.js';

export function attachInterceptors(client) {
  client.interceptors.request.use((config) => {
    const token = storageService.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (res) => res.data,
    (err) => {
      const msg = err.response?.data?.message || err.message || 'Network error';
      return Promise.reject(new Error(msg));
    },
  );
}
