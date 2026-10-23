import * as reservationRepo from '../repositories/reservation.repo.js';
import Reservation from '../models/reservation.model.js';
import { isExpired, now } from '../utils/time.utils.js';

export const createReservation = async (data) => {
  return await reservationRepo.createReservation(data);
};

export const cancelReservation = async (resId, userId) => {
  const reservation = await reservationRepo.findReservationById(resId);
  if (!reservation) {
    throw new Error('Reservation not found');
  }

  if (reservation.user._id.toString() !== userId.toString()) {
    throw new Error('Unauthorized');
  }

  reservation.status = 'cancelled';
  await reservation.save();
  return reservation;
};

export const getReservationById = async (id) => {
  const reservation = await reservationRepo.findReservationById(id);
  if (!reservation) {
    throw new Error('Reservation not found');
  }
  return reservation;
};

export const getReservationsByUser = async (userId) => {
  return await reservationRepo.getReservationsByUser(userId);
};

export const getActiveReservationForBook = async (bookId) => {
  return await reservationRepo.findActiveReservationForBook(bookId);
};

export const expireReservations = async () => {
  const activeReservations = await Reservation.find({ status: 'active' });
  const currentTime = now();

  for (const reservation of activeReservations) {
    if (isExpired(reservation.expiryDate)) {
      reservation.status = 'expired';
      await reservation.save();
    }
  }
};