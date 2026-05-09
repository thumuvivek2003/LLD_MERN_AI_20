import { create } from 'zustand';

export const useBookingStore = create((set) => ({
  selectedShow: null,
  selectedSeats: [],
  paymentId: null,
  setSelectedShow: (show) => set({ selectedShow: show }),
  setSelectedSeats: (seats) => set({ selectedSeats: seats }),
  setPaymentId: (id) => set({ paymentId: id }),
  reset: () => set({ selectedShow: null, selectedSeats: [], paymentId: null }),
}));
