const Reservation = require('../../models/Reservation');
const { RESERVATION_STATUS } = require('../../models/Reservation');

class ReservationRepository {
  async create(data) {
    return Reservation.create(data);
  }

  async findById(id) {
    return Reservation.findById(id)
      .populate('userId', 'name email')
      .populate('bookId', 'title author isbn coverImage');
  }

  async findPendingByUserAndBook(userId, bookId) {
    return Reservation.findOne({ userId, bookId, status: RESERVATION_STATUS.PENDING });
  }

  async findByUser(userId, skip = 0, limit = 20) {
    return Reservation.find({ userId })
      .populate('bookId', 'title author isbn coverImage status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countByUser(userId) {
    return Reservation.countDocuments({ userId });
  }

  async updateById(id, data) {
    return Reservation.findByIdAndUpdate(id, data, { new: true });
  }

  async completeReservation(userId, bookId) {
    return Reservation.findOneAndUpdate(
      { userId, bookId, status: RESERVATION_STATUS.PENDING },
      { status: RESERVATION_STATUS.COMPLETED },
      { new: true }
    );
  }

  async findExpiredPending() {
    return Reservation.find({
      status: RESERVATION_STATUS.PENDING,
      expiryDate: { $lt: new Date() },
    });
  }

  async findAllReservations(filter = {}, skip = 0, limit = 20) {
    return Reservation.find(filter)
      .populate('userId', 'name email')
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countAll(filter = {}) {
    return Reservation.countDocuments(filter);
  }
}

module.exports = new ReservationRepository();
