import { releaseExpiredLocks } from '../seats/seat.repository.js';

export const releaseExpiredSeatLocks = async () => {
  const result = await releaseExpiredLocks();
  console.log(`Released ${result.modifiedCount} expired seat locks`);
  return result.modifiedCount;
};
