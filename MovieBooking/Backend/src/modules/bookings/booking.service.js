import * as repo from './booking.repository.js';
import * as seatService from '../seats/seat.service.js';
import { Seat } from '../seats/seat.model.js';
import { generateRef } from '../../shared/utils/generateId.js';

export const getUserBookings = (userId) => repo.findByUser(userId);

export const getBooking = async (id) => {
  const b = await repo.findById(id);
  if (!b) throw Object.assign(new Error('Booking not found'), { statusCode: 404 });
  return b;
};

export const createBooking = async ({ showId, seatIds, paymentId, userId }) => {
  const seats = await Seat.find({ _id: { $in: seatIds } });
  const seatInfos = seats.map(s => ({ seatId: s._id, row: s.row, seatNumber: s.seatNumber, type: s.type, price: s.price }));
  const totalAmount = seatInfos.reduce((sum, s) => sum + s.price, 0);

  const booking = await repo.create({
    userId,
    showId,
    seats: seatInfos,
    totalAmount,
    status: 'confirmed',
    paymentId,
    bookingRef: generateRef('BK'),
  });

  await seatService.bookSeats(seatIds);
  return booking;
};

export const cancelBooking = async (id, userId) => {
  const booking = await repo.findById(id);
  if (!booking) throw Object.assign(new Error('Booking not found'), { statusCode: 404 });
  if (booking.userId.toString() !== userId.toString()) throw Object.assign(new Error('Unauthorized'), { statusCode: 403 });
  if (booking.status === 'cancelled') throw Object.assign(new Error('Already cancelled'), { statusCode: 400 });

  const seatIds = booking.seats.map(s => s.seatId);
  await seatService.cancelSeats(seatIds);
  return repo.update(id, { status: 'cancelled' });
};
