import { apiClient } from '../../../shared/api/axiosClient.js';
import { handleApiResponse } from '../../../shared/api/apiResponseHandler.js';

export function fetchNotifications(userId) {
  return handleApiResponse(apiClient.get(`/notifications/user/${userId}`));
}

export function fetchPreferences(userId) {
  return handleApiResponse(apiClient.get(`/users/${userId}/preferences`));
}

export function updatePreferences(userId, prefs) {
  return handleApiResponse(apiClient.put(`/users/${userId}/preferences`, prefs));
}
