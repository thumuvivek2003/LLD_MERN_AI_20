import { LOG_LEVEL } from '../../config/constants.js';
import { logId as newLogId } from '../../core/utils/id.util.js';
import { logger } from '../../core/utils/logger.util.js';

const RING_SIZE = 500;
const PERSIST_FROM = new Set([LOG_LEVEL.WARNING, LOG_LEVEL.ERROR, LOG_LEVEL.CRITICAL]);

/**
 * `GET /system/logs` reads real application log lines, not fixtures: this
 * service registers itself as a sink on the shared logger, so every
 * `logger.info(...)` anywhere in the process lands here.
 *
 * INFO stays in the ring only (a request log would otherwise write one document
 * per HTTP call); WARNING and above are also persisted so incidents survive a
 * restart.
 */
export class LogService {
  constructor({ systemLogRepository }) {
    this.systemLogRepository = systemLogRepository;
    this.ring = [];
    this.counters = { INFO: 0, WARNING: 0, ERROR: 0, CRITICAL: 0 };
    this.recent = []; // timestamps of errors, for the 15-minute error rate
  }

  attachToLogger() {
    logger.addSink((entry) => this.push(entry));
    return this;
  }

  push({ level, source, message, at }) {
    const row = { logId: newLogId(), at: at || new Date(), level, source, message };
    this.ring.unshift(row);
    if (this.ring.length > RING_SIZE) this.ring.length = RING_SIZE;
    this.counters[level] = (this.counters[level] || 0) + 1;

    if (level === LOG_LEVEL.ERROR || level === LOG_LEVEL.CRITICAL) {
      this.recent.push(Date.now());
      if (this.recent.length > 1000) this.recent.splice(0, 500);
    }
    if (PERSIST_FROM.has(level)) this.systemLogRepository.create(row).catch(() => {});
    return row;
  }

  list({ level, limit = 100 } = {}) {
    const filtered = level ? this.ring.filter((l) => l.level === level) : this.ring;
    return filtered.slice(0, Number(limit));
  }

  summary() {
    return { ...this.counters };
  }

  errorsSince(ms) {
    const cutoff = Date.now() - ms;
    return this.recent.filter((t) => t >= cutoff).length;
  }
}
