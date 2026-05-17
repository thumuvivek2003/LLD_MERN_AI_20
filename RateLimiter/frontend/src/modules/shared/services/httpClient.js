import axios from 'axios';
import { getAuthToken, useAuthStore } from '../../auth/store/auth.store.js';
import { extractErrorMessage } from '../utils/response.util.js';

let instance = null;

export function createHttpClient() {
  if (instance) return instance;

  instance = axios.create({
    baseURL: '/api',
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
  });

  instance.interceptors.request.use((config) => {
    const token = getAuthToken();
    config.headers = config.headers || {};
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err?.response?.status === 401) {
        useAuthStore.getState().clear();
      }
      err.displayMessage = extractErrorMessage(err);
      return Promise.reject(err);
    },
  );

  return instance;
}

export const http = createHttpClient();

export async function get(url, config) {
  const res = await http.get(url, config);
  return res.data;
}
export async function post(url, body, config) {
  const res = await http.post(url, body, config);
  return res.data;
}
export async function put(url, body, config) {
  const res = await http.put(url, body, config);
  return res.data;
}
export async function del(url, config) {
  const res = await http.delete(url, config);
  return res.data;
}
