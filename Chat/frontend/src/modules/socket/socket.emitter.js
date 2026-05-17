import { SOCKET_EVENTS } from '../../shared/constants/socket.constant.js';

function safeEmit(socket, event, payload) {
  if (!socket) return;
  socket.emit(event, payload);
}

export function emitMessage(socket, { chatId, content, tempId }) {
  safeEmit(socket, SOCKET_EVENTS.MESSAGE_SEND, { chatId, content, tempId });
}

export function emitTyping(socket, { chatId }) {
  safeEmit(socket, SOCKET_EVENTS.TYPING_START, { chatId });
}

export function emitTypingStart(socket, { chatId }) {
  safeEmit(socket, SOCKET_EVENTS.TYPING_START, { chatId });
}

export function emitTypingStop(socket, { chatId }) {
  safeEmit(socket, SOCKET_EVENTS.TYPING_STOP, { chatId });
}

export function emitReadReceipt(socket, { chatId, messageId }) {
  if (messageId) {
    safeEmit(socket, SOCKET_EVENTS.MESSAGE_READ, { messageId });
  } else if (chatId) {
    safeEmit(socket, SOCKET_EVENTS.CHAT_READ_ALL, { chatId });
  }
}

export function emitChatJoin(socket, { chatId }) {
  safeEmit(socket, SOCKET_EVENTS.CHAT_JOIN, { chatId });
}

export function emitChatLeave(socket, { chatId }) {
  safeEmit(socket, SOCKET_EVENTS.CHAT_LEAVE, { chatId });
}
