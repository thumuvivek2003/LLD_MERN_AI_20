/**
 * Minimal stdout logger. Keeping zero deps to stay simple.
 */
function fmt(level, args) {
  const ts = new Date().toISOString();
  return [`[${ts}] [${level}]`, ...args];
}

export function createLogger(scope = 'app') {
  return {
    info: (...a) => console.log(...fmt(`INFO ${scope}`, a)),
    warn: (...a) => console.warn(...fmt(`WARN ${scope}`, a)),
    error: (...a) => console.error(...fmt(`ERR  ${scope}`, a)),
    debug: (...a) => {
      if (process.env.NODE_ENV !== 'production') console.log(...fmt(`DBG  ${scope}`, a));
    },
  };
}

export const logger = createLogger('chat');
