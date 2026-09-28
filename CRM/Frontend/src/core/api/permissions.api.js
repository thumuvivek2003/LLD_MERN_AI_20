import http from './axios.client.js';
import ENDPOINTS from './api.endpoints.js';

/** Role + permission repository — CONTRACT §5.7. */
export const permissionsApi = {
  roles: () => http.get(ENDPOINTS.roles),
  createRole: (payload) => http.post(ENDPOINTS.roles, payload),
  updateRole: (roleId, patch) => http.patch(ENDPOINTS.role(roleId), patch),
  removeRole: (roleId) => http.delete(ENDPOINTS.role(roleId)),
  matrix: (roleId) => http.get(ENDPOINTS.permissions, { params: { roleId } }),
  saveMatrix: (payload) => http.put(ENDPOINTS.permissions, payload),
};

export default permissionsApi;
