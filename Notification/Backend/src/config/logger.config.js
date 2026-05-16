import { logger } from '../shared/logger/logger.js';

/**
 * Returns the shared logger singleton. Kept as a factory hook in case we
 * later want to swap to winston/pino without touching call sites.
 */
export function createLogger() {
  return logger;
}
