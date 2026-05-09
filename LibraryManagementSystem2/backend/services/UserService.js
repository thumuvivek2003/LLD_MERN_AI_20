import { UserRepository } from '../repositories/UserRepository.js';
import { UserStatus } from '../enums/UserStatus.js';

const userRepository = new UserRepository();

export class UserService {
  async addUser(data) {
    return userRepository.create(data);
  }

  async activateUser(id) {
    return userRepository.update(id, { status: UserStatus.ACTIVE });
  }

  async deactivateUser(id) {
    return userRepository.update(id, { status: UserStatus.INACTIVE });
  }

  async assignRole(id, role) {
    return userRepository.update(id, { role });
  }
}
