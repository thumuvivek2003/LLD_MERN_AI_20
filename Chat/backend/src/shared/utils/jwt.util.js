import jwt from 'jsonwebtoken';
import { env } from '../../config/env.config.js';

export function generateAccessToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret);
}
