import { apiClient } from '../../../shared/api/axiosClient.js';
import { handleApiResponse } from '../../../shared/api/apiResponseHandler.js';

export function fetchDashboardMetrics() {
  return handleApiResponse(apiClient.get('/admin/dashboard'));
}

export function fetchStats() {
  return handleApiResponse(apiClient.get('/admin/stats'));
}

export function fetchNotifications(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v != null && v !== '') params.append(k, v);
  });
  const qs = params.toString();
  return handleApiResponse(apiClient.get(`/notifications${qs ? `?${qs}` : ''}`));
}

export function fetchNotificationById(id) {
  return handleApiResponse(apiClient.get(`/notifications/${id}`));
}

export function retryNotification(id) {
  return handleApiResponse(apiClient.post(`/notifications/${id}/retry`));
}
