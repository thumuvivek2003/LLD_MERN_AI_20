import { randomBytes } from 'node:crypto';

const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford base32
const TIME_LEN = 10;
const RAND_LEN = 16;

function encodeTime(now) {
  let out = '';
  let t = now;
  for (let i = TIME_LEN - 1; i >= 0; i -= 1) {
    out = ENCODING[t % 32] + out;
    t = Math.floor(t / 32);
  }
  return out;
}

function encodeRandom() {
  const bytes = randomBytes(RAND_LEN);
  let out = '';
  for (let i = 0; i < RAND_LEN; i += 1) out += ENCODING[bytes[i] % 32];
  return out;
}

/** Lexicographically sortable, collision-resistant id (ULID shape). */
export const ulid = () => encodeTime(Date.now()) + encodeRandom();

export const newId = (prefix) => `${prefix}_${ulid()}`;

export const recordId = () => newId('rec');
export const indexId = () => newId('idx');
export const auditId = () => newId('aud');
export const eventId = () => newId('evt');
export const viewId = () => newId('view');
export const logId = () => newId('log');
export const alertId = () => newId('alr');
