import { get } from '../../shared/services/httpClient.js';

export async function fetchAdminDashboard() {
  return get('/admin/dashboard');
}

export async function fetchClientDashboard() {
  return get('/v1/usage');
}

export async function fetchCurrentStrategyPublic() {
  return get('/v1/strategy/current');
}
