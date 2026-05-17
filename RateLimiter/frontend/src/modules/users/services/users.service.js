import { get, post } from '../../shared/services/httpClient.js';

export async function fetchUsers() {
  return get('/admin/clients');
}

export async function fetchClientDetails(clientId) {
  return get(`/admin/clients/${clientId}`);
}

export async function createClient(payload) {
  return post('/admin/clients', payload);
}

export async function resetClient(clientId) {
  return post(`/admin/clients/${clientId}/reset`);
}

export async function blockClient(clientId) {
  return post(`/admin/clients/${clientId}/block`);
}

export async function unblockClient(clientId) {
  return post(`/admin/clients/${clientId}/unblock`);
}
