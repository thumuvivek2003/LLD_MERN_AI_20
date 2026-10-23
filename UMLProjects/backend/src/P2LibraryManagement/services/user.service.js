import User from '../models/user.model.js';
import * as userRepo from '../repositories/user.repo.js';

export const createUser = async (data) => {
  const existingUser = await userRepo.findUserByEmail(data.email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await User.hashPassword(data.password);
  return await userRepo.createUser({ ...data, password: hashedPassword });
};

export const getUsers = async () => {
  return await userRepo.findBooks({});
};

export const getUserById = async (id) => {
  const user = await userRepo.findUserById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateUser = async (id, data) => {
  if (data.password) {
    data.password = await User.hashPassword(data.password);
  }
  const user = await userRepo.updateUser(id, data);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const deleteUser = async (id) => {
  const user = await userRepo.deleteUser(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};