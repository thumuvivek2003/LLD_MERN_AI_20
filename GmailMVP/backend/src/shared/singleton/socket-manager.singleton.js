/**
 * SocketManager (Singleton)
 * ------------------------------------------------------------------
 * Holds the single Socket.IO server instance and exposes a tiny API
 * for emitting to a specific user's room. Rooms are named by userId
 * (a client joins its room via the `user:join` event).
 */
class SocketManager {
  constructor() {
    /** @type {import('socket.io').Server | null} */
    this.io = null;
  }

  /**
   * Register the io instance (called once from socket.config.js).
   * @param {import('socket.io').Server} io
   */
  setIO(io) {
    this.io = io;
  }

  /** @returns {import('socket.io').Server | null} */
  getIO() {
    return this.io;
  }

  /**
   * Emit an event to a single user's room.
   * @param {string} userId
   * @param {string} event
   * @param {*} payload
   */
  emitToUser(userId, event, payload) {
    if (!this.io) {
      console.warn('[SocketManager] emitToUser called before io initialized');
      return;
    }
    if (!userId) return;
    this.io.to(String(userId)).emit(event, payload);
  }
}

// Export a single shared instance (module cache guarantees singleton).
export const socketManager = new SocketManager();
export default socketManager;
