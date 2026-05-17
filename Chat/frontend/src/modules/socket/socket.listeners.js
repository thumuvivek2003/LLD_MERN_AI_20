import { SOCKET_EVENTS } from '../../shared/constants/socket.constant.js';
import { useChatStore } from '../chat/store/chat.store.js';
import { useMessageStore } from '../chat/store/message.store.js';
import { useTypingStore } from '../chat/store/typing.store.js';
import { useUserStore } from '../user/store/user.store.js';
import { useAuthStore } from '../auth/store/auth.store.js';

/**
 * Subscribe a single socket instance to every server -> client event we care
 * about, and route the payloads into the relevant zustand stores. Returns a
 * cleanup function that removes every listener it added.
 */
export function registerSocketListeners(socket) {
  if (!socket) return () => {};

  const handlers = {
    [SOCKET_EVENTS.MESSAGE_NEW]: (message) => {
      if (!message?.chatId) return;
      const me = useAuthStore.getState().user;
      useMessageStore.getState().appendMessage(message.chatId, message);
      useChatStore.getState().updateLastMessage(message.chatId, message, me?.id);
    },

    [SOCKET_EVENTS.MESSAGE_ACK]: ({ tempId, message }) => {
      if (!message?.chatId) return;
      useMessageStore.getState().reconcileTemp(message.chatId, tempId, message);
      const me = useAuthStore.getState().user;
      useChatStore.getState().updateLastMessage(message.chatId, message, me?.id);
    },

    [SOCKET_EVENTS.MESSAGE_DELIVERED]: ({
      messageId,
      chatId,
      userId,
      timestamp,
    }) => {
      if (!chatId || !messageId) return;
      useMessageStore
        .getState()
        .patchPerRecipient(chatId, messageId, {
          userId,
          status: 'DELIVERED',
          timestamp,
        });
      useMessageStore
        .getState()
        .patchMessageStatus(chatId, messageId, 'DELIVERED');
    },

    'message:read': ({ messageId, chatId, userId, timestamp }) => {
      if (!chatId || !messageId) return;
      useMessageStore
        .getState()
        .patchPerRecipient(chatId, messageId, {
          userId,
          status: 'READ',
          timestamp,
        });
      useMessageStore.getState().patchMessageStatus(chatId, messageId, 'READ');
    },

    'chat:read-all': ({ chatId, userId }) => {
      if (!chatId) return;
      // Mark all messages I sent in this chat as READ by `userId`.
      useMessageStore.getState().markChatRead(chatId, userId);
    },

    [SOCKET_EVENTS.PRESENCE_ONLINE]: ({ userId }) => {
      if (!userId) return;
      useUserStore.getState().markOnline(userId);
    },

    [SOCKET_EVENTS.PRESENCE_OFFLINE]: ({ userId, lastSeen }) => {
      if (!userId) return;
      useUserStore.getState().markOffline(userId, lastSeen);
    },

    [SOCKET_EVENTS.PRESENCE_SNAPSHOT]: ({ onlineUserIds = [] }) => {
      useUserStore.getState().setOnlineSnapshot(onlineUserIds);
    },

    'typing:start': ({ chatId, userId, userName }) => {
      if (!chatId || !userId) return;
      useTypingStore.getState().setTyping(chatId, userId, userName);
    },

    'typing:stop': ({ chatId, userId }) => {
      if (!chatId || !userId) return;
      useTypingStore.getState().clearTyping(chatId, userId);
    },

    [SOCKET_EVENTS.CHAT_NEW]: (chat) => {
      if (!chat) return;
      useChatStore.getState().upsertChat(chat);
    },

    [SOCKET_EVENTS.CHAT_UPDATED]: (chat) => {
      if (!chat) return;
      useChatStore.getState().upsertChat(chat);
    },

    [SOCKET_EVENTS.ERROR]: (err) => {
      console.warn('socket error event:', err);
    },
  };

  Object.entries(handlers).forEach(([event, fn]) => socket.on(event, fn));

  return () => {
    Object.entries(handlers).forEach(([event, fn]) => socket.off(event, fn));
  };
}
