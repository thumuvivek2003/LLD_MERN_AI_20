import FineModel from '../models/FineModel.js';
import { FineStatus } from '../enums/FineStatus.js';

export class FineRepository {
  async findById(id) {
    return FineModel.findById(id);
  }

  async create(data) {
    return FineModel.create(data);
  }

  async update(id, data) {
    return FineModel.findByIdAndUpdate(id, data, { new: true });
  }

  async findPendingByUser(userId) {
    return FineModel.find({ user: userId, status: FineStatus.PENDING });
  }

  async findAll() {
    return FineModel.find().populate('user borrowRequest');
  }
}
