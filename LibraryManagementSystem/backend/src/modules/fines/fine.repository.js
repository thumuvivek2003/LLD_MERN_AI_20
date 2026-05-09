const Fine = require('../../models/Fine');
const { FINE_STATUS } = require('../../models/Fine');

class FineRepository {
  async create(data) {
    return Fine.create(data);
  }

  async findById(id) {
    return Fine.findById(id)
      .populate('userId', 'name email')
      .populate('bookId', 'title author')
      .populate('borrowRecordId');
  }

  async findByUser(userId, skip = 0, limit = 20) {
    return Fine.find({ userId })
      .populate('bookId', 'title author isbn')
      .populate('borrowRecordId', 'borrowDate dueDate returnDate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countByUser(userId) {
    return Fine.countDocuments({ userId });
  }

  async findPendingByUser(userId) {
    return Fine.find({ userId, status: FINE_STATUS.PENDING });
  }

  async updateById(id, data) {
    return Fine.findByIdAndUpdate(id, data, { new: true });
  }

  async findAll(filter = {}, skip = 0, limit = 20) {
    return Fine.find(filter)
      .populate('userId', 'name email')
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countAll(filter = {}) {
    return Fine.countDocuments(filter);
  }

  async sumPendingFines() {
    const result = await Fine.aggregate([
      { $match: { status: FINE_STATUS.PENDING } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    return result[0]?.total || 0;
  }
}

module.exports = new FineRepository();
