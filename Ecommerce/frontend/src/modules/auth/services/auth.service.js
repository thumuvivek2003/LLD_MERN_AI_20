import { apiClient } from '../../../shared/services/apiClient.js';

export async function loginUser({ email, password }) {
  return apiClient.post('/auth/login', { email, password });
}

export async function registerUser({ name, email, password, role }) {
  return apiClient.post('/auth/register', { name, email, password, role });
}
