import { create } from 'zustand';

export const useUserNotificationStore = create((set) => ({
  notifications: [],
  loading: false,
  error: null,
  preferences: null,

  setNotifications: (notifications) => set({ notifications }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setPreferences: (preferences) => set({ preferences }),
  reset: () => set({ notifications: [], loading: false, error: null }),
}));
