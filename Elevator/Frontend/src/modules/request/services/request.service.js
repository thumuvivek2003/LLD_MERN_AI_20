import { fetchSnapshot } from '../../elevator/services/elevatorApi.service.js';

export async function fetchActiveRequests() {
  const snapshot = await fetchSnapshot();
  return snapshot.activeRequests || [];
}

export async function fetchCompletedRequests() {
  return [];
}
