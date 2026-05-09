import { SeatStatus } from '../constants/seatStatus.js';

export const groupSeatsByRow = (seats) => {
  return seats.reduce((acc, seat) => {
    (acc[seat.row] = acc[seat.row] || []).push(seat);
    return acc;
  }, {});
};

export const getSeatColor = (status, isSelected) => {
  if (isSelected) return '#e50914';
  switch (status) {
    case SeatStatus.AVAILABLE: return '#1a1a2e';
    case SeatStatus.LOCKED: return '#f59e0b';
    case SeatStatus.BOOKED: return '#374151';
    case SeatStatus.MAINTENANCE: return '#6b7280';
    default: return '#1a1a2e';
  }
};
