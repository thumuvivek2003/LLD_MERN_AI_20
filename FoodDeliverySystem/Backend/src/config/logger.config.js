let logger = null;

export const createLogger = () => {
  if (logger) return logger;
  const stamp = () => new Date().toISOString();
  logger = {
    info: (...args) => console.log(`[INFO ${stamp()}]`, ...args),
    warn: (...args) => console.warn(`[WARN ${stamp()}]`, ...args),
    error: (...args) => console.error(`[ERROR ${stamp()}]`, ...args),
  };
  return logger;
};
