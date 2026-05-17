import { BaseRepository } from '../../common/database/BaseRepository.js';
import { User } from './user.model.js';

export class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  findByEmail(email) {
    return this.model.findOne({ email: email.toLowerCase() });
  }

  findAll() {
    return this.model.find({}).sort({ createdAt: -1 });
  }
}

export const userRepository = new UserRepository();
