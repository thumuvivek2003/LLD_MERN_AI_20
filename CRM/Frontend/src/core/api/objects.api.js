import http from './axios.client.js';
import ENDPOINTS from './api.endpoints.js';

/** ObjectDefinition repository — CONTRACT §5.1. */
export const objectsApi = {
  list: (params) => http.get(ENDPOINTS.objects, { params }),
  get: (oid) => http.get(ENDPOINTS.object(oid)),
  create: (payload) => http.post(ENDPOINTS.objects, payload),
  update: (oid, patch) => http.patch(ENDPOINTS.object(oid), patch),
  remove: (oid) => http.delete(ENDPOINTS.object(oid)),
  publish: (oid) => http.post(ENDPOINTS.objectPublish(oid)),
  archive: (oid) => http.post(ENDPOINTS.objectArchive(oid)),
  restore: (oid) => http.post(ENDPOINTS.objectRestore(oid)),
  clone: (oid, payload) => http.post(ENDPOINTS.objectClone(oid), payload),
  versions: (oid) => http.get(ENDPOINTS.objectVersions(oid)),
  stats: (oid) => http.get(ENDPOINTS.objectStats(oid)),
};

export default objectsApi;
