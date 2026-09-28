import axios from 'axios';
import { ApiError } from './api.error.js';

export const USER_STORAGE_KEY = 'metaforce.userId';

export const getStoredUserId = () => localStorage.getItem(USER_STORAGE_KEY) || '';
export const setStoredUserId = (userId) => {
  if (userId) localStorage.setItem(USER_STORAGE_KEY, userId);
  else localStorage.removeItem(USER_STORAGE_KEY);
};

/** Non-JSON payloads (the CSV export stream) must bypass envelope unwrapping. */
const isRawResponse = (config) =>
  config?.responseType === 'blob' || config?.responseType === 'text';

/** `meta` is stapled onto the payload so hooks read pagination without a second channel. */
const attachMeta = (data, meta) => {
  if (!meta) return data;
  if (Array.isArray(data)) {
    const list = [...data];
    list.meta = meta;
    return list;
  }
  if (data && typeof data === 'object') return { ...data, meta };
  return data;
};

/**
 * Single axios instance for the whole app.
 * - request  : attaches `x-user-id` (CONTRACT §2)
 * - response : unwraps the `{ success, data, meta }` envelope (CONTRACT §1) so callers
 *              receive `data` directly, and normalises failures into `ApiError`.
 */
export const http = axios.create({ baseURL: '', timeout: 20000 });

http.interceptors.request.use((config) => {
  const userId = getStoredUserId();
  if (userId) config.headers['x-user-id'] = userId;
  return config;
});

http.interceptors.response.use(
  (response) => {
    if (isRawResponse(response.config)) return response.data;

    const body = response.data;
    if (body && typeof body === 'object' && 'success' in body) {
      if (body.success === false) throw ApiError.fromEnvelope(body, response.status);
      return attachMeta(body.data, body.meta);
    }
    return body;
  },
  (error) => {
    if (axios.isCancel(error)) throw error;
    const body = error.response?.data;
    if (body && typeof body === 'object' && body.error) {
      throw ApiError.fromEnvelope(body, error.response.status);
    }
    throw new ApiError({
      code: error.response ? 'INTERNAL_ERROR' : 'NETWORK_ERROR',
      message: error.response
        ? `Request failed with status ${error.response.status}`
        : 'Cannot reach the MetaForce API. Is the backend running on port 4000?',
      status: error.response?.status ?? 0,
    });
  },
);

export default http;
