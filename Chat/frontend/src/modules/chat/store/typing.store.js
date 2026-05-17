import { create } from 'zustand';

/**
 * Track which userIds are currently typing in which chat.
 */
export const useTypingStore = create((set, get) => ({
  byChat: {}, // { [chatId]: Map<userId, userName> }

  setTyping(chatId, userId, userName) {
    const map = new Map(get().byChat[chatId] || []);
    map.set(userId, userName || 'Someone');
    set({ byChat: { ...get().byChat, [chatId]: map } });
  },

  clearTyping(chatId, userId) {
    const map = new Map(get().byChat[chatId] || []);
    map.delete(userId);
    set({ byChat: { ...get().byChat, [chatId]: map } });
  },

  getTypingUsers(chatId) {
    const map = get().byChat[chatId];
    if (!map) return [];
    return Array.from(map.entries()).map(([userId, userName]) => ({
      userId,
      userName,
    }));
  },

  reset() {
    set({ byChat: {} });
  },
}));
