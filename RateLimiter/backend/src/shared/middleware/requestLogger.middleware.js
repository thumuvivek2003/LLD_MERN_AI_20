export function requestLogger(req, _res, next) {
  const ts = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.log(`[${ts}] ${req.method} ${req.originalUrl}`);
  next();
}
