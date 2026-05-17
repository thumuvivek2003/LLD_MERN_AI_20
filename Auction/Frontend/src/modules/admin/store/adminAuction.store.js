import { create } from 'zustand';

export const useAdminAuctionStore = create((set) => ({
  auctions: [],
  total: 0,
  loading: false,
  setLoading: (loading) => set({ loading }),
  setAuctions: (auctions, total = auctions.length) => set({ auctions, total }),
  updateAuction: (updated) =>
    set((state) => ({
      auctions: state.auctions.map((a) => (a.id === updated.id ? { ...a, ...updated } : a)),
    })),
  addAuction: (auction) =>
    set((state) => ({ auctions: [auction, ...state.auctions], total: state.total + 1 })),
}));
