import { BaseRepository } from '../../core/base/base.repository.js';
import { User } from './user.model.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  findByEmail(email) {
    return this.model.findOne({ email: String(email).toLowerCase() });
  }

  findByRole(role) {
    return this.model.find({ role });
  }
}

export const userRepository = new UserRepository();
