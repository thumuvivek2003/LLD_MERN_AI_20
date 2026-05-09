import { Booking } from './booking.model.js';

export const findAll = (filter = {}) => Booking.find(filter).populate('showId').populate('paymentId');
export const findById = (id) => Booking.findById(id).populate('showId').populate('paymentId');
export const findByUser = (userId) => Booking.find({ userId }).populate({ path: 'showId', populate: [{ path: 'movieId' }, { path: 'theaterId' }] });
export const create = (data) => Booking.create(data);
export const update = (id, data) => Booking.findByIdAndUpdate(id, data, { new: true });
