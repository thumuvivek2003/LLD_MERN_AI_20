class SocketManager {
  constructor() {
    this.io = null;
  }

  setIo(io) {
    this.io = io;
  }

  emitToUser(userId, event, payload) {
    if (!this.io || !userId) return;
    this.io.to(`user:${userId}`).emit(event, payload);
  }

  emitToRole(role, event, payload) {
    if (!this.io) return;
    this.io.to(`role:${role}`).emit(event, payload);
  }

  broadcast(event, payload) {
    if (!this.io) return;
    this.io.emit(event, payload);
  }
}

export const socketManager = new SocketManager();
