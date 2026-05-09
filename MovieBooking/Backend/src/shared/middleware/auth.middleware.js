import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { errorResponse } from '../utils/apiResponse.js';

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return errorResponse(res, 'Unauthorized', 401);

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    return errorResponse(res, 'Invalid token', 401);
  }
};
