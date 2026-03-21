import { create } from 'zustand';
import { Card } from '../utils/types';

interface UIState {
  isCardModalOpen: boolean;
  selectedCard: Card | null;
  isSidebarOpen: boolean;
  openCardModal: (card: Card) => void;
  closeCardModal: () => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCardModalOpen: false,
  selectedCard: null,
  isSidebarOpen: true,
  openCardModal: (card) => set({ isCardModalOpen: true, selectedCard: card }),
  closeCardModal: () => set({ isCardModalOpen: false, selectedCard: null }),
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
}));
