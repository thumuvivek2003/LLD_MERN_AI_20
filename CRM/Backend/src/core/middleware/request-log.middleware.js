import { logger } from '../utils/logger.util.js';

/** Tiny morgan replacement — also feeds the system log ring buffer via the logger sinks. */
export function requestLog(req, res, next) {
  const started = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - started) / 1e6;
    const line = `${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms`;
    if (res.statusCode >= 500) logger.error(line, null, 'http');
    else if (res.statusCode >= 400) logger.warn(line, null, 'http');
    else logger.info(line, null, 'http');
  });
  next();
}
