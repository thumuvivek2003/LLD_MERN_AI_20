export const SOCKET_EVENTS = Object.freeze({
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
  USER_TYPING: 'typing:start', // alias mapping for legacy file constant names
  ERROR: 'error',
});

// Bare exports for folder_file_structure compatibility
export const MESSAGE_SEND = SOCKET_EVENTS.MESSAGE_SEND;
export const MESSAGE_RECEIVED = SOCKET_EVENTS.MESSAGE_NEW;
export const MESSAGE_READ = SOCKET_EVENTS.MESSAGE_READ;
export const USER_TYPING = SOCKET_EVENTS.TYPING_START;
