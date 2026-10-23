import jwt from 'jsonwebtoken';
import { appConfig } from '../config/app.config.js';

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(token, appConfig.jwtSecret);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
