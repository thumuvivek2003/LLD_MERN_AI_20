import http from './axios.client.js';
import ENDPOINTS from './api.endpoints.js';

/** Lookup repository — CONTRACT §5.6. */
export const lookupsApi = {
  options: (params) => http.get(ENDPOINTS.lookupOptions, { params }),
  graph: () => http.get(ENDPOINTS.lookupGraph),
  stats: () => http.get(ENDPOINTS.lookupStats),
};

export default lookupsApi;
