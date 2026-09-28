import http from './axios.client.js';
import ENDPOINTS from './api.endpoints.js';

/** Audit repository — CONTRACT §5.8. */
export const auditApi = {
  list: (params) => http.get(ENDPOINTS.audit, { params }),
};

export default auditApi;
