import { userRepository } from './user.repository.js';
import { NotFoundError } from '../../common/errors/NotFoundError.js';

export class UserService {
  constructor(repo = userRepository) {
    this.repo = repo;
  }

  async getUserProfile(userId) {
    const user = await this.repo.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    return user.toSafeJSON();
  }

  async listAll() {
    const users = await this.repo.findAll();
    return users.map((u) => u.toSafeJSON());
  }

  async blockUser(id) {
    const user = await this.repo.update(id, { blocked: true });
    if (!user) throw new NotFoundError('User not found');
    return user.toSafeJSON();
  }

  async unblockUser(id) {
    const user = await this.repo.update(id, { blocked: false });
    if (!user) throw new NotFoundError('User not found');
    return user.toSafeJSON();
  }
}

export const userService = new UserService();
