/**
 * Socket event constants — must match the backend contract exactly.
 */
export const SOCKET_EVENTS = {
  // Client -> Server
  MESSAGE_SEND: 'message:send',
  MESSAGE_READ: 'message:read',
  CHAT_READ_ALL: 'chat:read-all',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  CHAT_JOIN: 'chat:join',
  CHAT_LEAVE: 'chat:leave',

  // Server -> Client
  MESSAGE_NEW: 'message:new',
  MESSAGE_ACK: 'message:ack',
  MESSAGE_DELIVERED: 'message:delivered',
  PRESENCE_ONLINE: 'presence:online',
  PRESENCE_OFFLINE: 'presence:offline',
  PRESENCE_SNAPSHOT: 'presence:snapshot',
  CHAT_NEW: 'chat:new',
  CHAT_UPDATED: 'chat:updated',
  ERROR: 'error',
};

export const MESSAGE_STATUS = {
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  READ: 'READ',
};

export const CHAT_TYPES = {
  DIRECT: 'DIRECT',
  GROUP: 'GROUP',
};
