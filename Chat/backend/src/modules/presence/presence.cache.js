/**
 * In-memory cache of additional presence metadata if needed.
 * Currently lightweight; SocketManager is the source of truth for
 * which users are online. This module exists per folder structure
 * and provides a stable place to extend later (e.g., heartbeat).
 */
class PresenceCache {
  constructor() {
    /** @type {Map<string, Set<string>>} */
    this._connections = new Map();
  }

  addConnection(userId, socketId) {
    const key = String(userId);
    if (!this._connections.has(key)) this._connections.set(key, new Set());
    this._connections.get(key).add(socketId);
  }

  removeConnection(userId, socketId) {
    const key = String(userId);
    const set = this._connections.get(key);
    if (!set) return;
    set.delete(socketId);
    if (set.size === 0) this._connections.delete(key);
  }

  getConnections(userId) {
    const set = this._connections.get(String(userId));
    return set ? [...set] : [];
  }
}

const presenceCache = new PresenceCache();
export default presenceCache;

export const addConnection = (uid, sid) => presenceCache.addConnection(uid, sid);
export const removeConnection = (uid, sid) => presenceCache.removeConnection(uid, sid);
export const getConnections = (uid) => presenceCache.getConnections(uid);
