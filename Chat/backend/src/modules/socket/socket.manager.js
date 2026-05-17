/**
 * Singleton in-memory map of userId -> Set<socketId>.
 * Supports multi-device: a user is online while ANY socket is alive.
 */
class SocketManager {
  constructor() {
    /** @type {Map<string, Set<string>>} */
    this._userToSockets = new Map();
    /** @type {Map<string, string>} */
    this._socketToUser = new Map();
  }

  addSocket(userId, socketId) {
    const key = String(userId);
    if (!this._userToSockets.has(key)) {
      this._userToSockets.set(key, new Set());
    }
    this._userToSockets.get(key).add(socketId);
    this._socketToUser.set(socketId, key);
  }

  removeSocket(socketId) {
    const userId = this._socketToUser.get(socketId);
    this._socketToUser.delete(socketId);
    if (!userId) return { userId: null, lastForUser: false };
    const set = this._userToSockets.get(userId);
    if (set) {
      set.delete(socketId);
      if (set.size === 0) {
        this._userToSockets.delete(userId);
        return { userId, lastForUser: true };
      }
    }
    return { userId, lastForUser: false };
  }

  getUserSockets(userId) {
    const set = this._userToSockets.get(String(userId));
    return set ? [...set] : [];
  }

  isOnline(userId) {
    const set = this._userToSockets.get(String(userId));
    return !!(set && set.size > 0);
  }

  getOnlineUserIds() {
    return [...this._userToSockets.keys()];
  }
}

const socketManager = new SocketManager();
export default socketManager;

// Bare exports for folder_file_structure compatibility
export const addSocket = (uid, sid) => socketManager.addSocket(uid, sid);
export const removeSocket = (sid) => socketManager.removeSocket(sid);
export const getUserSockets = (uid) => socketManager.getUserSockets(uid);
