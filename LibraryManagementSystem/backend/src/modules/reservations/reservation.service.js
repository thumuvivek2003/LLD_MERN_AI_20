const ApiError = require('../../utils/ApiError');
const reservationRepository = require('./reservation.repository');
const bookRepository = require('../books/book.repository');
const { RESERVATION_STATUS } = require('../../models/Reservation');

const RESERVATION_EXPIRY_DAYS = () => parseInt(process.env.RESERVATION_EXPIRY_DAYS) || 3;

class ReservationService {
  async createReservation(userId, bookId) {
    const book = await bookRepository.findById(bookId);
    if (!book) throw new ApiError(404, 'Book not found.');

    const existing = await reservationRepository.findPendingByUserAndBook(userId, bookId);
    if (existing) throw new ApiError(400, 'You already have a pending reservation for this book.');

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + RESERVATION_EXPIRY_DAYS());

    const reservation = await reservationRepository.create({ userId, bookId, expiryDate });

    // Mark book as reserved if no available copies
    if (book.availableCopies === 0) {
      await bookRepository.updateStatus(bookId, 'RESERVED');
    }

    return reservationRepository.findById(reservation._id);
  }

  async cancelReservation(reservationId, userId, isAdmin = false) {
    const reservation = await reservationRepository.findById(reservationId);
    if (!reservation) throw new ApiError(404, 'Reservation not found.');

    if (!isAdmin && reservation.userId._id.toString() !== userId.toString()) {
      throw new ApiError(403, 'Not authorized to cancel this reservation.');
    }

    if (reservation.status !== RESERVATION_STATUS.PENDING) {
      throw new ApiError(400, 'Only pending reservations can be cancelled.');
    }

    return reservationRepository.updateById(reservationId, { status: RESERVATION_STATUS.CANCELLED });
  }

  async getUserReservations(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [reservations, total] = await Promise.all([
      reservationRepository.findByUser(userId, skip, Number(limit)),
      reservationRepository.countByUser(userId),
    ]);
    return { reservations, total, page: Number(page), pages: Math.ceil(total / limit) };
  }

  async getAllReservations(page = 1, limit = 20, status) {
    const filter = status ? { status } : {};
    const skip = (page - 1) * limit;
    const [reservations, total] = await Promise.all([
      reservationRepository.findAllReservations(filter, skip, Number(limit)),
      reservationRepository.countAll(filter),
    ]);
    return { reservations, total, page: Number(page), pages: Math.ceil(total / limit) };
  }

  async expireReservations() {
    const expired = await reservationRepository.findExpiredPending();
    await Promise.all(
      expired.map((r) =>
        reservationRepository.updateById(r._id, { status: RESERVATION_STATUS.EXPIRED })
      )
    );
    return expired.length;
  }
}

module.exports = new ReservationService();
