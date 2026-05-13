import { userRepository } from '../user/user.repository.js';

export const authRepository = {
  findByEmail: (email) => userRepository.findByEmail(email),
  create: (data) => userRepository.create(data),
};
