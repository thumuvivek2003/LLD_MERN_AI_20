import { create } from 'zustand';
import { MESSAGE_STATUS } from '../../../shared/constants/socket.constant.js';
import { compareStatus } from '../../../shared/utils/message-status.util.js';

/**
 * Holds messages keyed by chatId. Supports optimistic append + reconcile
 * via tempId, plus per-recipient status patches.
 */
export const useMessageStore = create((set, get) => ({
  byChat: {}, // { [chatId]: Message[] }

  getMessages(chatId) {
    return get().byChat[chatId] || [];
  },

  setMessages(chatId, messages = []) {
    set({ byChat: { ...get().byChat, [chatId]: messages.slice() } });
  },

  appendMessage(chatId, message) {
    const list = get().byChat[chatId] || [];
    // Skip exact duplicates by id
    if (list.some((m) => m.id && m.id === message.id)) return;
    set({ byChat: { ...get().byChat, [chatId]: [...list, message] } });
  },

  prependMessages(chatId, messages = []) {
    const list = get().byChat[chatId] || [];
    const seen = new Set(list.map((m) => m.id));
    const fresh = messages.filter((m) => !seen.has(m.id));
    set({ byChat: { ...get().byChat, [chatId]: [...fresh, ...list] } });
  },

  reconcileTemp(chatId, tempId, message) {
    const list = get().byChat[chatId] || [];
    const idx = list.findIndex((m) => m.tempId === tempId);
    if (idx < 0) {
      get().appendMessage(chatId, message);
      return;
    }
    const next = [
      ...list.slice(0, idx),
      { ...list[idx], ...message },
      ...list.slice(idx + 1),
    ];
    set({ byChat: { ...get().byChat, [chatId]: next } });
  },

  patchMessageStatus(chatId, messageId, status) {
    const list = get().byChat[chatId] || [];
    const idx = list.findIndex((m) => m.id === messageId);
    if (idx < 0) return;
    const current = list[idx];
    // Only escalate to a "higher" status
    if (
      current.status &&
      compareStatus(status, current.status) <= 0
    ) {
      return;
    }
    const next = [
      ...list.slice(0, idx),
      { ...current, status },
      ...list.slice(idx + 1),
    ];
    set({ byChat: { ...get().byChat, [chatId]: next } });
  },

  patchPerRecipient(chatId, messageId, { userId, status, timestamp }) {
    const list = get().byChat[chatId] || [];
    const idx = list.findIndex((m) => m.id === messageId);
    if (idx < 0) return;
    const current = list[idx];
    const statuses = Array.isArray(current.statuses) ? [...current.statuses] : [];
    const sIdx = statuses.findIndex((s) => s.userId === userId);
    if (sIdx >= 0) {
      // never downgrade
      if (compareStatus(status, statuses[sIdx].status) > 0) {
        statuses[sIdx] = { ...statuses[sIdx], status, timestamp };
      }
    } else {
      statuses.push({ userId, status, timestamp });
    }
    const next = [
      ...list.slice(0, idx),
      { ...current, statuses },
      ...list.slice(idx + 1),
    ];
    set({ byChat: { ...get().byChat, [chatId]: next } });
  },

  markChatRead(chatId, userId) {
    const list = get().byChat[chatId] || [];
    const next = list.map((m) =>
      m.senderId === userId
        ? m
        : {
            ...m,
            status: MESSAGE_STATUS.READ,
          }
    );
    set({ byChat: { ...get().byChat, [chatId]: next } });
  },

  reset() {
    set({ byChat: {} });
  },
}));
