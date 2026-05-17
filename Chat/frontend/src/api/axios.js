import axios from 'axios';
import { getStorage, removeStorage } from '../shared/utils/storage.util.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getStorage('auth.token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // Token invalid / expired — clear and let route guards push to /login.
      removeStorage('auth.token');
      removeStorage('auth.user');
      // Defer to next tick to avoid loops if axios is called from store init.
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.startsWith('/login') &&
        !window.location.pathname.startsWith('/verify')
      ) {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Unwrap `{ success, data }` envelope and surface server errors cleanly.
 */
export async function unwrap(promise) {
  try {
    const res = await promise;
    const body = res?.data;
    if (body && body.success) return body.data;
    const message =
      body?.error?.message || 'Request failed';
    throw new Error(message);
  } catch (err) {
    if (err?.response?.data?.error?.message) {
      throw new Error(err.response.data.error.message);
    }
    throw err;
  }
}
