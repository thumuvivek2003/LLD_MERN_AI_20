// core/constants/socket.constants.js — a single source of truth for socket event names.
// Shared conceptually with the frontend's socket.constants.js so both sides agree.
export const SOCKET_EVENTS = Object.freeze({
  // client → server
  IDENTIFY: 'identify', // client announces which userId it is, joins its room

  // server → clients (Observer / Pub-Sub broadcasts)
  STATUS_CREATED: 'status:created',
  STATUS_VIEWED: 'status:viewed',
  STATUS_DELETED: 'status:deleted',
});

// Room helper: each user listens in a room named after their id.
export const userRoom = (userId) => `user:${userId}`;
