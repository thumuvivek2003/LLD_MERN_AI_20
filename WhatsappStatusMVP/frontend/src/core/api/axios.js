// core/api/axios.js — createHttpClient() [Singleton]
// One Axios instance for the whole app. An interceptor attaches the current
// user's id as `x-user-id` (our MVP auth) so services never think about it.
import axios from 'axios';

let client = null;
let currentUserId = null;

export function setCurrentUserId(userId) {
  currentUserId = userId;
}

export function createHttpClient() {
  if (client) return client;

  client = axios.create({ baseURL: '/api' });

  client.interceptors.request.use((config) => {
    if (currentUserId) config.headers['x-user-id'] = currentUserId;
    return config;
  });

  // Unwrap to data and normalise errors to a friendly message.
  client.interceptors.response.use(
    (res) => res.data,
    (err) => {
      const message = err.response?.data?.message || err.message || 'Network error';
      return Promise.reject(new Error(message));
    }
  );

  return client;
}

export const http = createHttpClient();
