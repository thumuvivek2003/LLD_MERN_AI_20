import { BaseService } from '../../core/base/base.service.js';
import { userRepository } from './user.repository.js';
import { AppError } from '../../core/exceptions/app.error.js';

class UserService extends BaseService {
  constructor() {
    super(userRepository);
  }

  async getProfile(id) {
    const u = await this.repository.findById(id);
    if (!u) throw new AppError('User not found', 404);
    return u;
  }

  async updateProfile(id, update) {
    const allowed = (({ name, phone }) => ({ name, phone }))(update);
    return this.repository.updateById(id, allowed);
  }

  list(filter) {
    return this.repository.find(filter, { sort: { createdAt: -1 } });
  }
}

export const userService = new UserService();
