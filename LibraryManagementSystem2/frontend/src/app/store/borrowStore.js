import { create } from 'zustand';

export const useBorrowStore = create((set) => ({
  requests: [],
  setRequests: (requests) => set({ requests }),
  updateRequest: (id, data) =>
    set((s) => ({ requests: s.requests.map((r) => (r._id === id ? { ...r, ...data } : r)) })),
}));
