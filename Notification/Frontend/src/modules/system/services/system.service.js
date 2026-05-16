import { apiClient } from '../../../shared/api/axiosClient.js';
import { handleApiResponse } from '../../../shared/api/apiResponseHandler.js';

export function fetchQueueStatus() {
  return handleApiResponse(apiClient.get('/system/queue'));
}

export function fetchRetryJobs() {
  return handleApiResponse(apiClient.get('/system/retry-queue'));
}

export function fetchDeliveryLogs() {
  return handleApiResponse(apiClient.get('/system/logs'));
}
