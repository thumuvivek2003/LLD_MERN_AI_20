import jwt from 'jsonwebtoken';
import { env } from '../../config/env.config.js';
import { UnauthorizedError } from '../errors/unauthorized.error.js';

export const generateAccessToken = (payload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
};
