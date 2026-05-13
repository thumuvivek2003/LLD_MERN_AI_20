import { ROLES } from '../../config/constants.js';

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const validateRegister = (body = {}) => {
  const errors = [];
  if (!body.name || typeof body.name !== 'string') errors.push('name is required');
  if (!body.email || !isEmail(body.email)) errors.push('valid email is required');
  if (!body.password || String(body.password).length < 6) errors.push('password min 6 chars');
  if (!body.role || !Object.values(ROLES).includes(body.role)) errors.push('role must be RIDER, DRIVER or ADMIN');
  return errors;
};

export const validateLogin = (body = {}) => {
  const errors = [];
  if (!body.email || !isEmail(body.email)) errors.push('valid email is required');
  if (!body.password) errors.push('password is required');
  return errors;
};
