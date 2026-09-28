import http from './axios.client.js';
import ENDPOINTS from './api.endpoints.js';

/** Field repository — CONTRACT §5.2. */
export const fieldsApi = {
  types: () => http.get(ENDPOINTS.fieldTypes),
  list: (oid) => http.get(ENDPOINTS.fields(oid)),
  create: (oid, payload) => http.post(ENDPOINTS.fields(oid), payload),
  update: (oid, fid, patch) => http.patch(ENDPOINTS.field(oid, fid), patch),
  remove: (oid, fid) => http.delete(ENDPOINTS.field(oid, fid)),
  reorder: (oid, order) => http.put(ENDPOINTS.fieldsReorder(oid), { order }),
};

export default fieldsApi;
