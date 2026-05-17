// Thin wrapper so non-socket layers (event subscribers) can emit to rooms
// without holding a reference to the io instance.

class SocketManager {
  constructor() {
    this.io = null;
  }

  setIO(io) {
    this.io = io;
  }

  emitToRoom(room, event, payload) {
    if (!this.io) return;
    this.io.to(room).emit(event, payload);
  }

  joinRoom(socket, room) {
    socket.join(room);
  }

  leaveRoom(socket, room) {
    socket.leave(room);
  }
}

export const socketManager = new SocketManager();
