import { Seat } from './seat.model.js';

export const findByShow = (showId) => Seat.find({ showId });
export const findById = (id) => Seat.findById(id);
export const findManyByIds = (ids) => Seat.find({ _id: { $in: ids } });
export const create = (data) => Seat.create(data);
export const createMany = (seats) => Seat.insertMany(seats);
export const update = (id, data) => Seat.findByIdAndUpdate(id, data, { new: true });
export const updateMany = (filter, data) => Seat.updateMany(filter, data);
export const releaseExpiredLocks = () => Seat.updateMany(
  { status: 'locked', lockExpiresAt: { $lt: new Date() } },
  { status: 'available', lockedBy: null, lockedAt: null, lockExpiresAt: null }
);
