import { get, put } from '../../shared/services/httpClient.js';

export async function fetchConfig() {
  return get('/admin/config');
}

export async function saveConfig(payload) {
  return put('/admin/config', payload);
}
