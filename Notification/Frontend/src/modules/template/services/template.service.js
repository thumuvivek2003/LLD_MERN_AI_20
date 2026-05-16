import { apiClient } from '../../../shared/api/axiosClient.js';
import { handleApiResponse } from '../../../shared/api/apiResponseHandler.js';

export function fetchTemplates() {
  return handleApiResponse(apiClient.get('/templates'));
}

export function fetchTemplate(id) {
  return handleApiResponse(apiClient.get(`/templates/${id}`));
}

export function createTemplate(payload) {
  return handleApiResponse(apiClient.post('/templates', payload));
}

export function createTemplateVersion(id, payload) {
  return handleApiResponse(apiClient.post(`/templates/${id}/versions`, payload));
}

export function fetchTemplateVersions(id) {
  return handleApiResponse(apiClient.get(`/templates/${id}/versions`));
}
