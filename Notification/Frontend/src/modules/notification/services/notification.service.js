import { apiClient } from '../../../shared/api/axiosClient.js';
import { handleApiResponse } from '../../../shared/api/apiResponseHandler.js';

export function sendNotification(payload) {
  return handleApiResponse(apiClient.post('/notifications/send', payload));
}

export function sendGroupNotification(payload) {
  return handleApiResponse(apiClient.post('/notifications/send-group', payload));
}

export function triggerEvent(payload) {
  return handleApiResponse(apiClient.post('/notifications/trigger', payload));
}

export function fetchUsers() {
  return handleApiResponse(apiClient.get('/users'));
}
