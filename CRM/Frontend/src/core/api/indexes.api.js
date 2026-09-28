import http from './axios.client.js';
import ENDPOINTS from './api.endpoints.js';

/** Index repository — CONTRACT §5.5. */
export const indexesApi = {
  list: (params) => http.get(ENDPOINTS.indexes, { params }),
  summary: () => http.get(ENDPOINTS.indexesSummary),
  get: (indexId) => http.get(ENDPOINTS.index(indexId)),
  create: (payload) => http.post(ENDPOINTS.indexes, payload),
  rebuild: (indexId) => http.post(ENDPOINTS.indexRebuild(indexId)),
  remove: (indexId) => http.delete(ENDPOINTS.index(indexId)),
  rebuildAll: () => http.post(ENDPOINTS.indexesRebuildAll),
};

export default indexesApi;
