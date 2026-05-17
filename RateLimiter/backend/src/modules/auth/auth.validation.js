import { AppError } from '../../shared/exceptions/AppError.js';

export function validateLoginPayload(body) {
  const { username, password } = body || {};
  if (!username || typeof username !== 'string') {
    throw new AppError('username is required', 400, 'VALIDATION_ERROR');
  }
  if (!password || typeof password !== 'string') {
    throw new AppError('password is required', 400, 'VALIDATION_ERROR');
  }
  return { username: username.trim(), password };
}

export function validateRegisterPayload(body) {
  const { username, password } = body || {};
  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    throw new AppError('username must be at least 3 characters', 400, 'VALIDATION_ERROR');
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new AppError('password must be at least 6 characters', 400, 'VALIDATION_ERROR');
  }
  return { username: username.trim(), password };
}
