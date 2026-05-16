import { logger } from '../logger/logger.js';

export function logRequest(req, res, next) {
  const startedAt = Date.now();
  res.on('finish', () => {
    logger.info('http.request', {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      ms: Date.now() - startedAt,
      actorId: req.actor?.id ?? null,
      actorRole: req.actor?.role ?? null,
    });
  });
  next();
}
