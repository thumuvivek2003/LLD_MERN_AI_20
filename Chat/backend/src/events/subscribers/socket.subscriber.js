import { subscribe } from '../event-bus.js';
import { EVENTS } from '../event.constants.js';
import { SOCKET_EVENTS } from '../../modules/socket/socket.events.js';
import { emitToUser, emitToUsers, emitToAll } from '../../modules/socket/socket.emitter.js';

/**
 * Fans out domain events to socket clients per API_CONTRACT.md.
 */
export function handle() {
  // no-op stub for folder structure parity; real handlers below.
}

export function register() {
  subscribe(EVENTS.MESSAGE_CREATED, ({ memberIds, senderId, dto }) => {
    const recipients = memberIds.filter((id) => String(id) !== String(senderId));
    emitToUsers(recipients, SOCKET_EVENTS.MESSAGE_NEW, dto);
  });

  subscribe(EVENTS.MESSAGE_DELIVERED, (payload) => {
    // Notify chat room (members in that chat) of delivery.
    // We use the chat-scoped room; clients join via chat:join.
    emitToAll(SOCKET_EVENTS.MESSAGE_DELIVERED, payload);
  });

  subscribe(EVENTS.MESSAGE_READ, (payload) => {
    emitToAll('message:read', payload);
  });

  subscribe(EVENTS.CHAT_READ_ALL, (payload) => {
    emitToAll('chat:read-all', payload);
  });

  subscribe(EVENTS.USER_ONLINE, ({ userId }) => {
    emitToAll(SOCKET_EVENTS.PRESENCE_ONLINE, { userId });
  });

  subscribe(EVENTS.USER_OFFLINE, ({ userId, lastSeen }) => {
    emitToAll(SOCKET_EVENTS.PRESENCE_OFFLINE, {
      userId,
      lastSeen: lastSeen instanceof Date ? lastSeen.toISOString() : lastSeen,
    });
  });

  subscribe(EVENTS.CHAT_CREATED, ({ chat, recipientIds }) => {
    for (const uid of recipientIds || []) {
      emitToUser(uid, SOCKET_EVENTS.CHAT_NEW, chat);
    }
  });

  subscribe(EVENTS.CHAT_UPDATED, ({ chat }) => {
    if (!chat?.members) return;
    for (const m of chat.members) {
      emitToUser(m.userId, SOCKET_EVENTS.CHAT_UPDATED, chat);
    }
  });
}
