import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import * as repo from './auth.repository.js';

export const register = async (data) => {
  const exists = await repo.findByEmail(data.email);
  if (exists) throw Object.assign(new Error('Email already registered'), { statusCode: 409 });
  const user = await repo.createUser(data);
  return mapToDto(user);
};

export const login = async ({ email, password }) => {
  const user = await repo.findByEmail(email);
  console.log(user)
  if (!user || !(await user.comparePassword(password))) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  return { user: mapToDto(user), token };
};

const mapToDto = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});
