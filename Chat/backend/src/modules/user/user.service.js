import * as userRepo from './user.repository.js';
import { AppError, ERROR_CODES } from '../../shared/constants/errors.constant.js';

export async function fetchProfile(userId) {
  const user = await userRepo.findById(userId);
  if (!user) throw new AppError(ERROR_CODES.NOT_FOUND, 'User not found');
  return user;
}

export async function fetchUsers(currentUserId) {
  return userRepo.findAllExcept(currentUserId);
}

export async function fetchUserById(id) {
  const user = await userRepo.findById(id);
  if (!user) throw new AppError(ERROR_CODES.NOT_FOUND, 'User not found');
  return user;
}

export async function updateMyName(userId, name) {
  if (!name || !name.trim()) {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Name is required');
  }
  const updated = await userRepo.updateName(userId, name.trim());
  if (!updated) throw new AppError(ERROR_CODES.NOT_FOUND, 'User not found');
  return updated;
}
