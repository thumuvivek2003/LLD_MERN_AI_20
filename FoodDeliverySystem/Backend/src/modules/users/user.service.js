import { userRepository } from './user.repository.js';
import { NotFoundError } from '../../core/errors/not-found.error.js';
import { ALL_ROLES } from '../../core/constants/roles.constants.js';
import { BadRequestError } from '../../core/errors/bad-request.error.js';
import { toUserDto, toUserDtoList } from './user.mapper.js';

class UserService {
  async getAllUsers(filter = {}) {
    const users = await userRepository.findAll(filter);
    return toUserDtoList(users);
  }

  async changeUserRole(id, role) {
    if (!ALL_ROLES.includes(role)) throw new BadRequestError('Invalid role');
    const updated = await userRepository.updateUserRole(id, role);
    if (!updated) throw new NotFoundError('User not found');
    return toUserDto(updated);
  }

  async toggleBlockUser(id, isBlocked) {
    const updated = await userRepository.toggleBlocked(id, Boolean(isBlocked));
    if (!updated) throw new NotFoundError('User not found');
    return toUserDto(updated);
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return toUserDto(user);
  }
}

export const userService = new UserService();
