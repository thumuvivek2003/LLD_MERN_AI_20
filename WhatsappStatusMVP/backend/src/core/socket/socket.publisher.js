// core/socket/socket.publisher.js — Observer / Pub-Sub publisher side.
// Services call these to broadcast domain events; they never touch io directly.
import { getIO } from '../../config/socket.js';
import { SOCKET_EVENTS, userRoom } from '../constants/socket.constants.js';
import { createEvent } from './socket.factory.js';

// Emit to a set of recipient user rooms (their friends), so a billion-user
// system never broadcasts globally — only to the owner's neighbourhood.
function emitToUsers(recipientIds, event) {
  const io = getIO();
  const rooms = recipientIds.map((id) => userRoom(String(id)));
  if (rooms.length === 0) return;
  io.to(rooms).emit(event.name, event.payload);
}

export const socketPublisher = {
  publishStatusCreated({ ownerId, audienceIds }) {
    emitToUsers(audienceIds, createEvent(SOCKET_EVENTS.STATUS_CREATED, { ownerId: String(ownerId) }));
  },

  // Notify the owner (their room) that someone viewed — live viewer counts.
  publishStatusViewed({ ownerId, statusId, viewerId }) {
    emitToUsers([ownerId], createEvent(SOCKET_EVENTS.STATUS_VIEWED, {
      statusId: String(statusId),
      viewerId: String(viewerId),
    }));
  },

  publishStatusDeleted({ ownerId, statusId, audienceIds }) {
    emitToUsers([ownerId, ...audienceIds], createEvent(SOCKET_EVENTS.STATUS_DELETED, {
      statusId: String(statusId),
      ownerId: String(ownerId),
    }));
  },
};
