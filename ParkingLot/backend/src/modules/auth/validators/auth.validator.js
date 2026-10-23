import { ValidationError } from '../../../shared/exceptions/validation-error.js';
import { UserRole } from '../../../shared/enums/user-role.enum.js';

export const validateLogin = ({ username, password }) => {
  if (!username || !password) throw new ValidationError('username and password required');
};

export const validateCreateUser = ({ username, password, role }) => {
  if (!username || !password || !role) throw new ValidationError('username, password, role required');
  if (!Object.values(UserRole).includes(role)) throw new ValidationError('invalid role');
};
