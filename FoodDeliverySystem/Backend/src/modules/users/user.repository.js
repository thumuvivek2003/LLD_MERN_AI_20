import { BaseRepository } from '../../core/base/base.repository.js';
import { UserModel } from './user.model.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(UserModel);
  }

  findUserByEmail(email) {
    return this.model.findOne({ email: String(email).toLowerCase() });
  }

  updateUserRole(id, role) {
    return this.model.findByIdAndUpdate(id, { role }, { new: true });
  }

  toggleBlocked(id, isBlocked) {
    return this.model.findByIdAndUpdate(id, { isBlocked }, { new: true });
  }

  findByRole(role) {
    return this.model.find({ role });
  }
}

export const userRepository = new UserRepository();
