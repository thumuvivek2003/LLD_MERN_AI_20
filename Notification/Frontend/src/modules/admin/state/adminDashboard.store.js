import { create } from 'zustand';

export const useAdminDashboardStore = create((set) => ({
  metrics: null,
  notifications: [],
  filters: { status: '', channel: '', eventType: '' },
  loading: false,
  error: null,

  setMetrics: (metrics) => set({ metrics }),
  setNotifications: (notifications) => set({ notifications }),
  setFilters: (filters) =>
    set((s) => ({ filters: { ...s.filters, ...filters } })),
  resetFilters: () => set({ filters: { status: '', channel: '', eventType: '' } }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
