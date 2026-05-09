import * as seatState from './seatState.service.js';
import * as seatLock from './seatLock.service.js';
import * as repo from './seat.repository.js';

export const getSeatLayout = (showId) => seatState.getSeatsForShow(showId);
export const lockSeats = (showId, seatIds, userId) => seatLock.lockSeats(showId, seatIds, userId);
export const unlockSeats = (seatIds) => seatLock.unlockSeats(seatIds);
export const bookSeats = async (seatIds) => {
  await repo.updateMany({ _id: { $in: seatIds } }, { status: 'booked', lockedBy: null, lockedAt: null, lockExpiresAt: null });
};
export const cancelSeats = async (seatIds) => {
  await repo.updateMany({ _id: { $in: seatIds } }, { status: 'available', lockedBy: null });
};
