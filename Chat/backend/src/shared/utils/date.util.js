export function getCurrentTimestamp() {
  return new Date();
}

export function toIso(date) {
  return date instanceof Date ? date.toISOString() : new Date(date).toISOString();
}
