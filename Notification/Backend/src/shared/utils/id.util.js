import crypto from 'node:crypto';

export function generateId(prefix = '') {
  const id = crypto.randomBytes(6).toString('hex');
  return prefix ? `${prefix}_${id}` : id;
}
