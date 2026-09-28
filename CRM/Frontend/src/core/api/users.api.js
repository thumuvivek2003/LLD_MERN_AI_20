import http from './axios.client.js';
import ENDPOINTS from './api.endpoints.js';

/** Identity repository — CONTRACT §2. */
export const usersApi = {
  list: () => http.get(ENDPOINTS.users),
  me: () => http.get(ENDPOINTS.me),
  updateRole: (userId, roleId) => http.patch(ENDPOINTS.user(userId), { roleId }),
};

export default usersApi;
