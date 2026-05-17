import { api, unwrap } from '../../../api/axios.js';

/**
 * GET /api/messages/:chatId — paginated message history.
 */
export function fetchMessages(chatId, { limit = 50, before } = {}) {
  const params = { limit };
  if (before) params.before = before;
  return unwrap(api.get(`/messages/${chatId}`, { params }));
}

/**
 * POST /api/messages — send a message via REST (server also emits socket events).
 */
export function sendMessage({ chatId, content, tempId }) {
  return unwrap(api.post('/messages', { chatId, content, tempId }));
}

/**
 * PATCH /api/messages/:messageId/read — mark single message read.
 */
export function markMessageRead(messageId) {
  return unwrap(api.patch(`/messages/${messageId}/read`));
}

/**
 * PATCH /api/messages/:chatId/read-all — mark all chat messages read.
 */
export function markChatReadAll(chatId) {
  return unwrap(api.patch(`/messages/${chatId}/read-all`));
}
