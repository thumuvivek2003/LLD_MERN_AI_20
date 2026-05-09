import { randomBytes } from 'crypto';

export const generateRef = (prefix = '') => {
  const id = randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}${id}`;
};
