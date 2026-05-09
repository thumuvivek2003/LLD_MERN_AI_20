const BorrowRecord = require('../../models/BorrowRecord');
const { BORROW_STATUS } = require('../../models/BorrowRecord');

class BorrowRepository {
  async create(data) {
    return BorrowRecord.create(data);
  }

  async findById(id) {
    return BorrowRecord.findById(id).populate('userId', 'name email membershipId').populate('bookId', 'title author isbn');
  }

  async findActiveByUserAndBook(userId, bookId) {
    return BorrowRecord.findOne({
      userId,
      bookId,
      status: { $in: [BORROW_STATUS.ACTIVE, BORROW_STATUS.OVERDUE] },
    });
  }

  async findByUser(userId, skip = 0, limit = 20) {
    return BorrowRecord.find({ userId })
      .populate('bookId', 'title author isbn coverImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countByUser(userId) {
    return BorrowRecord.countDocuments({ userId });
  }

  async updateById(id, data) {
    return BorrowRecord.findByIdAndUpdate(id, data, { new: true });
  }

  async findOverdue() {
    return BorrowRecord.find({
      status: BORROW_STATUS.ACTIVE,
      dueDate: { $lt: new Date() },
    });
  }

  async findAllActive(skip = 0, limit = 20) {
    return BorrowRecord.find({ status: { $in: [BORROW_STATUS.ACTIVE, BORROW_STATUS.OVERDUE] } })
      .populate('userId', 'name email')
      .populate('bookId', 'title author')
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(limit);
  }

  async countActive() {
    return BorrowRecord.countDocuments({ status: { $in: [BORROW_STATUS.ACTIVE, BORROW_STATUS.OVERDUE] } });
  }
}

module.exports = new BorrowRepository();
