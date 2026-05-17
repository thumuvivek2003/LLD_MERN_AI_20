import { userRepository } from '../repositories/user.repository.js';
import { ROLES } from '../../../shared/constants/roles.constant.js';
import { toUserList } from '../dtos/user.dto.js';

export const userService = {
  async getUsers() {
    const users = await userRepository.getUsers();
    return toUserList(users);
  },

  async getEligibleUsers() {
    const users = await userRepository.getUsers({ role: ROLES.MEMBER });
    return toUserList(users);
  },
};
