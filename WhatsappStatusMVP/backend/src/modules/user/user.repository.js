// modules/user/user.repository.js — Repository Pattern (extends BaseRepository)
import { BaseRepository } from '../../core/repositories/base.repository.js';
import { UserModel } from './user.model.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(UserModel);
  }

  findAll() {
    return this.model.find().sort({ name: 1 }).lean();
  }

  findByIds(ids) {
    return this.model.find({ _id: { $in: ids } }).lean();
  }
}

// Singleton instance shared across the app.
export const userRepository = new UserRepository();
