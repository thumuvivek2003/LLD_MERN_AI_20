/**
 * Mirror of the contract's socket event names. Kept here for the socket
 * module to be self-contained (imports from shared constants are fine too).
 */
export const MESSAGE_RECEIVED = 'message:new';
export const MESSAGE_ACK = 'message:ack';
export const MESSAGE_DELIVERED = 'message:delivered';
export const MESSAGE_READ = 'message:read';
export const CHAT_READ_ALL = 'chat:read-all';
export const USER_TYPING = 'typing:start';
export const USER_TYPING_STOP = 'typing:stop';
export const USER_ONLINE = 'presence:online';
export const USER_OFFLINE = 'presence:offline';
export const PRESENCE_SNAPSHOT = 'presence:snapshot';
export const CHAT_NEW = 'chat:new';
export const CHAT_UPDATED = 'chat:updated';
export const ERROR = 'error';

// Client -> Server
export const SEND_MESSAGE = 'message:send';
export const READ_MESSAGE = 'message:read';
export const READ_ALL = 'chat:read-all';
export const TYPING_START = 'typing:start';
export const TYPING_STOP = 'typing:stop';
export const CHAT_JOIN = 'chat:join';
export const CHAT_LEAVE = 'chat:leave';
