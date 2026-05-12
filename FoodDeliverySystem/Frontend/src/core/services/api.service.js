import axios from 'axios';
import { getAccessToken, clearAccessToken } from './token.service.js';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

instance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const status = err.response?.status;
    const message = err.response?.data?.message || err.message || 'Network error';
    if (status === 401) {
      clearAccessToken();
      if (!window.location.pathname.startsWith('/login')) window.location.href = '/login';
    }
    return Promise.reject(new Error(message));
  }
);

export const getRequest = (url, config) => instance.get(url, config);
export const postRequest = (url, body, config) => instance.post(url, body, config);
export const putRequest = (url, body, config) => instance.put(url, body, config);
export const patchRequest = (url, body, config) => instance.patch(url, body, config);
export const deleteRequest = (url, config) => instance.delete(url, config);

export default instance;
