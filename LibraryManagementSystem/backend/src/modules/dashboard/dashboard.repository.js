const User = require('../../models/User');
const Book = require('../../models/Book');
const BorrowRecord = require('../../models/BorrowRecord');
const Reservation = require('../../models/Reservation');
const Fine = require('../../models/Fine');
const { BORROW_STATUS } = require('../../models/BorrowRecord');
const { RESERVATION_STATUS } = require('../../models/Reservation');
const { FINE_STATUS } = require('../../models/Fine');

class DashboardRepository {
  async getSummaryStats() {
    const [
      totalUsers, totalBooks, activeBorrows, overdueBorrows,
      pendingReservations, pendingFinesResult, recentBorrows,
    ] = await Promise.all([
      User.countDocuments({ role: 'user', isActive: true }),
      Book.countDocuments(),
      BorrowRecord.countDocuments({ status: BORROW_STATUS.ACTIVE }),
      BorrowRecord.countDocuments({ status: BORROW_STATUS.OVERDUE }),
      Reservation.countDocuments({ status: RESERVATION_STATUS.PENDING }),
      Fine.aggregate([
        { $match: { status: FINE_STATUS.PENDING } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      BorrowRecord.find({ status: { $in: [BORROW_STATUS.ACTIVE, BORROW_STATUS.OVERDUE] } })
        .populate('userId', 'name email')
        .populate('bookId', 'title author')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    return {
      totalUsers,
      totalBooks,
      activeBorrows,
      overdueBorrows,
      pendingReservations,
      pendingFinesTotal: pendingFinesResult[0]?.total || 0,
      recentBorrows,
    };
  }

  async getBooksByGenre() {
    return Book.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
  }
}

module.exports = new DashboardRepository();
