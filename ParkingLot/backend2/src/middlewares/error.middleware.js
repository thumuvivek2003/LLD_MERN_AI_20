import { Logger } from '../utils/Logger.js';

export const errorMiddleware = (err, _req, res, _next) => {
  Logger.error(err.message);
  const status = err.status || 400;
  res.status(status).json({ error: err.message || 'Internal error' });
};
