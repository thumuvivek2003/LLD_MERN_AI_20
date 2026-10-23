import { create } from 'zustand';

export const useSelectedLotStore = create((set) => ({
  lotId: null,
  setLotId: (lotId) => set({ lotId }),
  clear: () => set({ lotId: null }),
}));
