import { BaseRepository } from '../../core/base/base.repository.js';
import { UserModel } from './user.model.js';

export class UserRepository extends BaseRepository {
  constructor(model = UserModel) {
    super(model);
  }

  findByUserId(userId) {
    return this.model.findOne({ userId }).lean();
  }

  listAll() {
    return this.model.find({}).sort({ createdAt: 1 }).lean();
  }

  updateByUserId(userId, update) {
    return this.model.findOneAndUpdate({ userId }, update, { new: true }).lean();
  }

  countByRoleId(roleId) {
    return this.model.countDocuments({ roleId });
  }
}
