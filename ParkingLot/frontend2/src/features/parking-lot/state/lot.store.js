import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useLotStore = create(
  persist(
    (set) => ({
      selectedLotId: null,
      setSelectedLotId: (id) => set({ selectedLotId: id }),
      clearSelectedLot: () => set({ selectedLotId: null }),
    }),
    {
      name: 'parking-lot.selected-lot',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
