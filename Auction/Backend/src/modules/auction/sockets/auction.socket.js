import { socketManager } from '../../../shared/socket/socketManager.singleton.js';
import { logInfo } from '../../../shared/utils/logger.util.js';

// Pure transport. No business logic; subscribers (liveBid/auctionClose) push to rooms.
export function registerAuctionSocket(socket) {
  socket.on('auction:join', ({ auctionId } = {}) => {
    if (!auctionId) return;
    socketManager.joinRoom(socket, `auction:${auctionId}`);
    logInfo(`socket ${socket.id} joined auction:${auctionId}`);
  });

  socket.on('auction:leave', ({ auctionId } = {}) => {
    if (!auctionId) return;
    socketManager.leaveRoom(socket, `auction:${auctionId}`);
    logInfo(`socket ${socket.id} left auction:${auctionId}`);
  });
}

export function joinAuctionRoom(socket, auctionId) {
  socketManager.joinRoom(socket, `auction:${auctionId}`);
}

export function leaveAuctionRoom(socket, auctionId) {
  socketManager.leaveRoom(socket, `auction:${auctionId}`);
}
