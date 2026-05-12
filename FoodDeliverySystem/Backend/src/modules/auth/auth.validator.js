import { ALL_ROLES, USER_ROLES } from '../../core/constants/roles.constants.js';

export const registerValidation = (body) => {
  const errors = [];
  if (!body.name || body.name.trim().length < 2) errors.push('Name is required');
  if (!body.email || !/^\S+@\S+\.\S+$/.test(body.email)) errors.push('Valid email is required');
  if (!body.password || body.password.length < 6) errors.push('Password must be ≥ 6 chars');
  if (body.role && !ALL_ROLES.includes(body.role)) errors.push('Invalid role');
  return errors;
};

export const loginValidation = (body) => {
  const errors = [];
  if (!body.email) errors.push('Email is required');
  if (!body.password) errors.push('Password is required');
  return errors;
};

export const defaultRole = USER_ROLES.CUSTOMER;
