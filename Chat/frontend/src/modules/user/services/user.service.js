import { api, unwrap } from '../../../api/axios.js';

/**
 * GET /api/users — contacts list (all users excluding self).
 */
export function fetchUsers() {
  return unwrap(api.get('/users'));
}

/**
 * GET /api/users/me — current profile.
 */
export function fetchProfile() {
  return unwrap(api.get('/users/me'));
}

/**
 * PATCH /api/users/me — update own profile (name).
 */
export function updateProfile(patch) {
  return unwrap(api.patch('/users/me', patch));
}

/**
 * GET /api/users/:id — single user.
 */
export function fetchUserById(id) {
  return unwrap(api.get(`/users/${id}`));
}
