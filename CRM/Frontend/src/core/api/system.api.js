import http from './axios.client.js';
import ENDPOINTS from './api.endpoints.js';

/** System console repository — CONTRACT §5.9. */
export const systemApi = {
  health: () => http.get(ENDPOINTS.systemHealth),
  metrics: () => http.get(ENDPOINTS.systemMetrics),
  overview: () => http.get(ENDPOINTS.systemOverview),
  events: (params) => http.get(ENDPOINTS.systemEvents, { params }),
  jobs: () => http.get(ENDPOINTS.systemJobs),
  runJob: (jobId) => http.post(ENDPOINTS.systemJobRun(jobId)),
  cache: () => http.get(ENDPOINTS.systemCache),
  refreshCache: () => http.post(ENDPOINTS.systemCacheRefresh),
  invalidateCache: () => http.delete(ENDPOINTS.systemCache),
  validationStats: () => http.get(ENDPOINTS.systemValidationStats),
  logs: (params) => http.get(ENDPOINTS.systemLogs, { params }),
  logsSummary: () => http.get(ENDPOINTS.systemLogsSummary),
  alerts: () => http.get(ENDPOINTS.systemAlerts),
  ackAlert: (alertId) => http.post(ENDPOINTS.systemAlertAck(alertId)),
  storage: () => http.get(ENDPOINTS.systemStorage),
  settings: () => http.get(ENDPOINTS.systemSettings),
  updateSettings: (patch) => http.patch(ENDPOINTS.systemSettings, patch),
};

export default systemApi;
