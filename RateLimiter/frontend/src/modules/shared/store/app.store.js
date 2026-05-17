import { create } from 'zustand';

export const useAppStore = create((set) => ({
  loading: false,
  theme: 'light',
  toast: null,
  setLoading: (loading) => set({ loading }),
  setTheme: (theme) => set({ theme }),
  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),
}));
