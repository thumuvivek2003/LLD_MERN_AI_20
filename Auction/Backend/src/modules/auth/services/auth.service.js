import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loadEnv } from '../../../config/env.config.js';
import { authRepository } from '../repositories/auth.repository.js';
import { ROLES } from '../../../shared/constants/roles.constant.js';
import { ValidationError } from '../../../shared/errors/validation.error.js';
import { AuthenticationError, AuthorizationError } from '../../../shared/errors/authorization.error.js';
import { toUserDTO } from '../dtos/auth.dto.js';

function signToken(user) {
  const { jwtSecret, jwtExpiresIn } = loadEnv();
  return jwt.sign(
    { sub: user.id, role: user.role, name: user.name, email: user.email },
    jwtSecret,
    { expiresIn: jwtExpiresIn },
  );
}

export const authService = {
  async createUser({ name, email, password, role }, actor) {
    const existing = await authRepository.findByEmail(email);
    if (existing) throw new ValidationError('Email already registered');

    // ADMIN creation locked to existing ADMIN actor only.
    let finalRole = role || ROLES.MEMBER;
    if (finalRole === ROLES.ADMIN && (!actor || actor.role !== ROLES.ADMIN)) {
      throw new AuthorizationError('Only an ADMIN can create another ADMIN');
    }

    const hash = await bcrypt.hash(password, 10);
    const doc = await authRepository.create({
      name,
      email: email.toLowerCase(),
      password: hash,
      role: finalRole,
      walletBalance: finalRole === ROLES.MEMBER ? 50010 : 0,
    });
    const user = toUserDTO(doc);
    return { user, token: signToken(user) };
  },

  async authenticateUser({ email, password }) {
    const doc = await authRepository.findByEmail(email);
    if (!doc) throw new AuthenticationError('Invalid credentials');
    const ok = await bcrypt.compare(password, doc.password);
    if (!ok) throw new AuthenticationError('Invalid credentials');
    const user = toUserDTO(doc);
    return { user, token: signToken(user) };
  },

  async getMe(userId) {
    const doc = await authRepository.findById(userId);
    if (!doc) throw new AuthenticationError('User not found');
    return toUserDTO(doc);
  },
};
