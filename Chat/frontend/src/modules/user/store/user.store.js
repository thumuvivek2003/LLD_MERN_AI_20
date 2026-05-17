import { create } from 'zustand';

/**
 * Tracks contacts + presence (online ids + last seen map).
 */
export const useUserStore = create((set, get) => ({
  users: [],
  onlineIds: new Set(),
  lastSeenMap: {},

  setUsers(users) {
    set({ users });
  },

  setOnlineSnapshot(ids = []) {
    set({ onlineIds: new Set(ids) });
  },

  markOnline(userId) {
    const next = new Set(get().onlineIds);
    next.add(userId);
    set({ onlineIds: next });
  },

  markOffline(userId, lastSeen) {
    const next = new Set(get().onlineIds);
    next.delete(userId);
    set({
      onlineIds: next,
      lastSeenMap: { ...get().lastSeenMap, [userId]: lastSeen },
    });
  },

  isOnline(userId) {
    return get().onlineIds.has(userId);
  },

  getLastSeen(userId) {
    return get().lastSeenMap[userId] || null;
  },

  reset() {
    set({ users: [], onlineIds: new Set(), lastSeenMap: {} });
  },
}));
