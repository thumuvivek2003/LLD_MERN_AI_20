import { api, unwrap } from '../../../api/axios.js';

/**
 * GET /api/chats — current user's chats (sorted by updatedAt desc on server).
 */
export function fetchChats() {
  return unwrap(api.get('/chats'));
}

/**
 * POST /api/chats/direct — find-or-create a direct chat with another user.
 */
export function createDirectChat(userId) {
  return unwrap(api.post('/chats/direct', { userId }));
}

/**
 * POST /api/chats/group — create a new group chat.
 */
export function createGroupChat({ name, memberIds }) {
  return unwrap(api.post('/chats/group', { name, memberIds }));
}

/**
 * GET /api/chats/:chatId — single chat detail.
 */
export function fetchChatById(chatId) {
  return unwrap(api.get(`/chats/${chatId}`));
}
