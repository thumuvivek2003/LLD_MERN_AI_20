import socketManager from './socket.manager.js';

let _io = null;

/**
 * Stored at gateway init so other modules can emit without circular imports.
 */
export function setIO(io) {
  _io = io;
}

export function getIO() {
  return _io;
}

export function emitToUser(userId, event, payload) {
  if (!_io) return;
  const sockets = socketManager.getUserSockets(userId);
  for (const sid of sockets) {
    _io.to(sid).emit(event, payload);
  }
}

export function emitToUsers(userIds, event, payload) {
  for (const uid of userIds) {
    emitToUser(uid, event, payload);
  }
}

/**
 * Emits to a socket.io room representing a chat. Clients should
 * `chat:join` to subscribe; we also fan-out per-user as a fallback.
 */
export function emitToGroup(chatId, event, payload) {
  if (!_io) return;
  _io.to(`chat:${String(chatId)}`).emit(event, payload);
}

export function emitToAll(event, payload) {
  if (!_io) return;
  _io.emit(event, payload);
}
