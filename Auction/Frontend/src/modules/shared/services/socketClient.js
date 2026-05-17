import { io } from 'socket.io-client';
import { SOCKET_EVENTS } from '../constants/socketEvents.constant.js';

// Singleton wrapper around socket.io-client. Acts as a thin pub-sub facade
// so React components don't import socket.io directly.
class SocketClient {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (this.socket && this.socket.connected) return this.socket;

    const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
    });
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinAuctionRoom(auctionId) {
    const s = this.connect();
    s.emit(SOCKET_EVENTS.JOIN_AUCTION, { auctionId });
  }

  leaveAuctionRoom(auctionId) {
    if (!this.socket) return;
    this.socket.emit(SOCKET_EVENTS.LEAVE_AUCTION, { auctionId });
  }

  on(event, handler) {
    const s = this.connect();
    s.on(event, handler);
    return () => s.off(event, handler);
  }

  off(event, handler) {
    if (!this.socket) return;
    this.socket.off(event, handler);
  }
}

export const socketClient = new SocketClient();
