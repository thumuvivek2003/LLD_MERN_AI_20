import * as repo from './seat.repository.js';
import { addMinutes } from '../../shared/utils/dateHelper.js';
import { env } from '../../config/env.js';

export const lockSeats = async (showId, seatIds, userId) => {
  const seats = await repo.findManyByIds(seatIds);

  const unavailable = seats.filter(s => s.status !== 'available' && !(s.status === 'locked' && s.lockedBy?.toString() === userId.toString()));
  if (unavailable.length > 0) {
    throw Object.assign(new Error('Some seats are not available'), { statusCode: 409 });
  }

  const expiresAt = addMinutes(new Date(), env.seatLockMinutes);
  await repo.updateMany(
    { _id: { $in: seatIds } },
    { status: 'locked', lockedBy: userId, lockedAt: new Date(), lockExpiresAt: expiresAt }
  );

  return { lockedUntil: expiresAt };
};

export const unlockSeats = async (seatIds) => {
  await repo.updateMany(
    { _id: { $in: seatIds } },
    { status: 'available', lockedBy: null, lockedAt: null, lockExpiresAt: null }
  );
};
