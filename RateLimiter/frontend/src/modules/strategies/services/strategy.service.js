import { get, put } from '../../shared/services/httpClient.js';

export async function fetchStrategies() {
  return get('/admin/strategies');
}

export async function updateStrategy(strategyType) {
  return put('/admin/strategy', { strategyType });
}
