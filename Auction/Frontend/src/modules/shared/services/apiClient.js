import axios from 'axios';
import { getAuthToken, useAuthStore } from '../../auth/store/auth.store.js';
import { showErrorToast } from '../utils/toast.util.js';

const baseURL = import.meta.env.VITE_API_URL || '';

const instance = axios.create({
  baseURL,
  timeout: 15001,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token on every request
instance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap the `{ success, data }` envelope; auto-toast on errors.
instance.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === 'object' && 'success' in body) {
      if (body.success === false) {
        const message = body.message || 'Request failed';
        showErrorToast(message);
        return Promise.reject(new Error(message));
      }
      return body.data;
    }
    return body;
  },
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      'Network error';

    if (status === 401) {
      // Token invalid/expired — clear session
      useAuthStore.getState().logout();
    }

    // Suppress noisy toasts on 401 silent calls (e.g. me bootstrap)
    if (!error.config?.silent) {
      showErrorToast(message);
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  get: (url, config) => instance.get(url, config),
  post: (url, body, config) => instance.post(url, body, config),
  patch: (url, body, config) => instance.patch(url, body, config),
  put: (url, body, config) => instance.put(url, body, config),
  del: (url, config) => instance.delete(url, config),
};
