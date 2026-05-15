const fmt = (level, msg) => `[${new Date().toISOString()}] [${level}] ${msg}`;

export const logger = {
  info: (msg) => console.log(fmt("INFO", msg)),
  warn: (msg) => console.warn(fmt("WARN", msg)),
  error: (msg) => console.error(fmt("ERROR", msg)),
};
