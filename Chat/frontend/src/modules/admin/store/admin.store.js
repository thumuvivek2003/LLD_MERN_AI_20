import { create } from 'zustand';

export const useAdminStore = create((set) => ({
  stats: null,
  users: [],
  groups: [],
  setStats: (stats) => set({ stats }),
  setUsers: (users) => set({ users }),
  setGroups: (groups) => set({ groups }),
  patchUser: (updated) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)),
    })),
}));
