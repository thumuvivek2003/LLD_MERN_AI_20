import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      updateUser: (patch) =>
        set((state) => ({ user: state.user ? { ...state.user, ...patch } : state.user })),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auction.auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export function getAuthToken() {
  return useAuthStore.getState().token;
}

export function getAuthUser() {
  return useAuthStore.getState().user;
}
