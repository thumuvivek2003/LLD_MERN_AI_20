import { create } from 'zustand';

export const useUserStore = create((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  updateUser: (id, data) =>
    set((s) => ({ users: s.users.map((u) => (u._id === id ? { ...u, ...data } : u)) })),
}));
