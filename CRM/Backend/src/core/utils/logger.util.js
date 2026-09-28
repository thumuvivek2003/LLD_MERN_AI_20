import { LOG_LEVEL } from '../../config/constants.js';

const ts = () => new Date().toISOString();

/**
 * Console logger with a pluggable sink. The system module attaches its
 * in-memory ring buffer as a sink at boot, which is how `/system/logs`
 * returns genuine application log lines rather than invented ones.
 */
const sinks = [];

function emit(level, source, message, meta) {
  const line = `[${level.padEnd(8)}] ${ts()} (${source}) ${message}`;
  if (level === LOG_LEVEL.ERROR || level === LOG_LEVEL.CRITICAL) console.error(line, meta ?? '');
  else if (level === LOG_LEVEL.WARNING) console.warn(line, meta ?? '');
  else console.log(line, meta ?? '');
  for (const sink of sinks) sink({ level, source, message, at: new Date() });
}

export const logger = {
  addSink: (fn) => sinks.push(fn),
  info: (message, meta, source = 'app') => emit(LOG_LEVEL.INFO, source, message, meta),
  warn: (message, meta, source = 'app') => emit(LOG_LEVEL.WARNING, source, message, meta),
  error: (message, meta, source = 'app') => emit(LOG_LEVEL.ERROR, source, message, meta),
  critical: (message, meta, source = 'app') => emit(LOG_LEVEL.CRITICAL, source, message, meta),
};
