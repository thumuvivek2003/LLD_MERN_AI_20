import { create } from 'zustand';

/**
 * Holds the chat list aggregate state and exposes a fluent API for updates.
 */
export const useChatStore = create((set, get) => ({
  chats: [],
  loadedAt: null,

  setChats(chats = []) {
    set({ chats: sortByActivity(chats), loadedAt: Date.now() });
  },

  upsertChat(chat) {
    if (!chat || !chat.id) return;
    const idx = get().chats.findIndex((c) => c.id === chat.id);
    const next =
      idx >= 0
        ? [...get().chats.slice(0, idx), { ...get().chats[idx], ...chat }, ...get().chats.slice(idx + 1)]
        : [chat, ...get().chats];
    set({ chats: sortByActivity(next) });
  },

  updateLastMessage(chatId, message, currentUserId) {
    const idx = get().chats.findIndex((c) => c.id === chatId);
    if (idx < 0) return;
    const chat = get().chats[idx];
    const isMine = message.senderId === currentUserId;
    const unread = isMine ? chat.unreadCount || 0 : (chat.unreadCount || 0) + 1;
    const next = {
      ...chat,
      lastMessage: {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        createdAt: message.createdAt,
        status: message.status,
      },
      unreadCount: unread,
      updatedAt: message.createdAt,
    };
    const list = [
      ...get().chats.slice(0, idx),
      next,
      ...get().chats.slice(idx + 1),
    ];
    set({ chats: sortByActivity(list) });
  },

  clearUnread(chatId) {
    const list = get().chats.map((c) =>
      c.id === chatId ? { ...c, unreadCount: 0 } : c
    );
    set({ chats: list });
  },

  removeChat(chatId) {
    set({ chats: get().chats.filter((c) => c.id !== chatId) });
  },

  getChatById(chatId) {
    return get().chats.find((c) => c.id === chatId) || null;
  },

  reset() {
    set({ chats: [], loadedAt: null });
  },
}));

function sortByActivity(chats) {
  return [...chats].sort((a, b) => {
    const ta = new Date(a.updatedAt || 0).getTime();
    const tb = new Date(b.updatedAt || 0).getTime();
    return tb - ta;
  });
}
