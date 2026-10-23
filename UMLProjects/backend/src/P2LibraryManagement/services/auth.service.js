import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { getConfig } from '../config/env.js';
import * as userRepo from '../repositories/user.repo.js';

export const registerUser = async (data) => {
  const existingUser = await userRepo.findUserByEmail(data.email);
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  const hashedPassword = await User.hashPassword(data.password);
  const userData = { ...data, password: hashedPassword };
  const user = await userRepo.createUser(userData);

  const token = generateToken(user);
  return { user, token };
};

export const loginUser = async (data) => {
  const user = await userRepo.findUserByEmail(data.email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.comparePassword(data.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user);
  return { user, token };
};

export const verifyToken = (token) => {
  const config = getConfig();
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const generateToken = (user) => {
  const config = getConfig();
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiry }
  );
};