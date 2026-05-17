import { api, unwrap } from '../../../api/axios.js';

/**
 * POST /api/groups/:chatId/members — add members (admin only).
 */
export function addMembers(chatId, memberIds) {
  return unwrap(api.post(`/groups/${chatId}/members`, { memberIds }));
}

/**
 * DELETE /api/groups/:chatId/members/:userId — remove a member.
 */
export function removeMember(chatId, userId) {
  return unwrap(api.delete(`/groups/${chatId}/members/${userId}`));
}

/**
 * PATCH /api/groups/:chatId — rename a group.
 */
export function renameGroup(chatId, name) {
  return unwrap(api.patch(`/groups/${chatId}`, { name }));
}
