/**
 * Tiny JSON logger with a ring buffer for /api/system/logs.
 * Singleton — module-scoped.
 */
const RING_SIZE = 500;
const ring = [];

function pushRing(entry) {
  ring.push(entry);
  if (ring.length > RING_SIZE) ring.shift();
}

function emit(level, message, meta) {
  const entry = {
    level,
    message,
    meta: meta ?? null,
    at: new Date().toISOString(),
  };
  pushRing(entry);
  // Plain console output is enough for MVP
  const line = JSON.stringify(entry);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

export const logger = {
  info(message, meta) {
    emit('info', message, meta);
  },
  warn(message, meta) {
    emit('warn', message, meta);
  },
  error(message, meta) {
    emit('error', message, meta);
  },
  getRecent(limit = 100) {
    if (!limit || limit >= ring.length) return [...ring].reverse();
    return ring.slice(-limit).reverse();
  },
};
