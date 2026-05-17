const ts = () => new Date().toISOString();

export function logInfo(msg, meta) {
  if (meta !== undefined) console.log(`[${ts()}] [INFO] ${msg}`, meta);
  else console.log(`[${ts()}] [INFO] ${msg}`);
}

export function logError(msg, err) {
  if (err) console.error(`[${ts()}] [ERROR] ${msg}`, err);
  else console.error(`[${ts()}] [ERROR] ${msg}`);
}
