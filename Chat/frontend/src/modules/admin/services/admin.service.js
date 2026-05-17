import { api, unwrap } from '../../../api/axios.js';

export function fetchStats() {
  return unwrap(api.get('/admin/stats'));
}

export function fetchUsers() {
  return unwrap(api.get('/admin/users'));
}

export function fetchUserById(id) {
  return unwrap(api.get(`/admin/users/${id}`));
}

export function blockUser(id) {
  return unwrap(api.patch(`/admin/users/${id}/block`));
}

export function unblockUser(id) {
  return unwrap(api.patch(`/admin/users/${id}/unblock`));
}

export function fetchGroups() {
  return unwrap(api.get('/admin/groups'));
}
