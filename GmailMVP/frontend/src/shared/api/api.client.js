import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

/**
 * Unwraps the shared response envelope: { success, data } | { success, error }.
 * Returns `data` on success; throws a normalized Error otherwise.
 */
function unwrap(response) {
  const payload = response?.data;
  if (payload && typeof payload === 'object' && 'success' in payload) {
    if (payload.success) return payload.data;
    const err = payload.error || {};
    const e = new Error(err.message || 'Request failed');
    e.code = err.code;
    throw e;
  }
  // Fallback: some servers may return raw data without the envelope.
  return payload;
}

function normalizeError(error) {
  if (error?.response?.data?.error?.message) {
    const e = new Error(error.response.data.error.message);
    e.code = error.response.data.error.code;
    return e;
  }
  if (error?.code === 'ECONNABORTED') {
    return new Error('Request timed out. Is the backend running?');
  }
  if (error?.message === 'Network Error') {
    return new Error('Cannot reach the server. Is the backend running?');
  }
  return error instanceof Error ? error : new Error('Unexpected error');
}

export async function get(url, config) {
  try {
    return unwrap(await apiClient.get(url, config));
  } catch (e) {
    throw normalizeError(e);
  }
}

export async function post(url, body, config) {
  try {
    return unwrap(await apiClient.post(url, body, config));
  } catch (e) {
    throw normalizeError(e);
  }
}

export default apiClient;
