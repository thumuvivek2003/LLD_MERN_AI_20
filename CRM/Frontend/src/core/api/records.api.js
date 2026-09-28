import http from './axios.client.js';
import ENDPOINTS from './api.endpoints.js';

/** Record repository — CONTRACT §5.3. */
export const recordsApi = {
  list: (oid, params) => http.get(ENDPOINTS.records(oid), { params }),
  get: (oid, rid) => http.get(ENDPOINTS.record(oid, rid)),
  create: (oid, recordJson) => http.post(ENDPOINTS.records(oid), { recordJson }),
  update: (oid, rid, recordJson) => http.patch(ENDPOINTS.record(oid, rid), { recordJson }),
  archive: (oid, rid) => http.post(ENDPOINTS.recordArchive(oid, rid)),
  restore: (oid, rid) => http.post(ENDPOINTS.recordRestore(oid, rid)),
  related: (oid, rid) => http.get(ENDPOINTS.recordRelated(oid, rid)),
  history: (oid, rid) => http.get(ENDPOINTS.recordHistory(oid, rid)),
  bulk: (oid, payload) => http.post(ENDPOINTS.recordsBulk(oid), payload),
  import: (oid, payload) => http.post(ENDPOINTS.recordsImport(oid), payload),
  export: (oid, params) =>
    http.get(ENDPOINTS.recordsExport(oid), { params, responseType: 'text' }),
};

export default recordsApi;
