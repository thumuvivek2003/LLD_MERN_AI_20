// modules/user/user.service.js — business logic for users.
import { userRepository } from './user.repository.js';
import { toUserResponse, toUserResponseList } from './user.mapper.js';
import { NotFoundError } from '../../core/errors/notFound.error.js';

class UserService {
  async listUsers() {
    const users = await userRepository.findAll();
    return toUserResponseList(users);
  }

  // MVP "login" is just selecting a user; we echo back the chosen profile.
  async loginUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    return toUserResponse(user);
  }
}

export const userService = new UserService();
