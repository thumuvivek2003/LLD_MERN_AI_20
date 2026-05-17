export const logger = {
  info(msg, meta) {
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${msg}`, meta ?? '');
  },
  error(msg, meta) {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${msg}`, meta ?? '');
  },
};

export const info = (msg, meta) => logger.info(msg, meta);
export const error = (msg, meta) => logger.error(msg, meta);
