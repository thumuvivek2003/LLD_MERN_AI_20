import * as userRepository from './user.repository.js';
import { toUserDTO, toUserDTOList } from './user.mapper.js';
import { AppError } from '../../shared/utils/app-error.util.js';

/** @returns {Promise<object[]>} all users as DTOs */
export async function getAllUsers() {
  const users = await userRepository.findAll();
  return toUserDTOList(users);
}

/**
 * @param {string} id
 * @returns {Promise<object>} user DTO
 */
export async function getUserById(id) {
  const user = await userRepository.findById(id);
  if (!user) throw AppError.notFound('User not found', 'USER_NOT_FOUND');
  return toUserDTO(user);
}
