import { get, post } from '../../shared/services/httpClient.js';

export async function login({ username, password }) {
  return post('/auth/login', { username, password });
}

export async function registerClient({ username, password }) {
  return post('/auth/register', { username, password });
}

export async function fetchMe() {
  return get('/auth/me');
}
