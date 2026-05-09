import BorrowRequestModel from '../models/BorrowRequestModel.js';
import { RequestStatus } from '../enums/RequestStatus.js';

export class BorrowRepository {
  async findById(id) {
    return BorrowRequestModel.findById(id).populate('user book');
  }

  async create(data) {
    return BorrowRequestModel.create(data);
  }

  async update(id, data) {
    return BorrowRequestModel.findByIdAndUpdate(id, data, { new: true });
  }

  async findByUser(userId) {
    return BorrowRequestModel.find({ user: userId }).populate('book');
  }

  async findActiveByUser(userId) {
    return BorrowRequestModel.find({ user: userId, status: RequestStatus.APPROVED });
  }

  async findOverdue() {
    return BorrowRequestModel.find({
      status: RequestStatus.APPROVED,
      dueDate: { $lt: new Date() },
    }).populate('user book');
  }
}
