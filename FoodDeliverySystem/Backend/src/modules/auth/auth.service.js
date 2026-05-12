import { userRepository } from '../users/user.repository.js';
import { hashPassword, comparePassword } from '../../core/utils/bcrypt.util.js';
import { generateAccessToken } from '../../core/utils/jwt.util.js';
import { BadRequestError } from '../../core/errors/bad-request.error.js';
import { UnauthorizedError } from '../../core/errors/unauthorized.error.js';
import { defaultRole } from './auth.validator.js';
import { buildAuthResponseDto } from './auth.dto.js';

class AuthService {
  async registerUser(payload) {
    const existing = await userRepository.findUserByEmail(payload.email);
    if (existing) throw new BadRequestError('Email already registered');
    const hashed = await hashPassword(payload.password);
    const user = await userRepository.create({
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: hashed,
      phoneNumber: payload.phoneNumber,
      address: payload.address,
      role: payload.role || defaultRole,
      location: payload.location || { lat: null, lng: null },
    });
    const token = this.#signToken(user);
    return buildAuthResponseDto(user, token);
  }

  async loginUser({ email, password }) {
    const user = await userRepository.findUserByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');
    if (user.isBlocked) throw new UnauthorizedError('Account is blocked');
    const ok = await comparePassword(password, user.password);
    if (!ok) throw new UnauthorizedError('Invalid credentials');
    const token = this.#signToken(user);
    return buildAuthResponseDto(user, token);
  }

  #signToken(user) {
    return generateAccessToken({ sub: user._id.toString(), role: user.role, email: user.email });
  }
}

export const authService = new AuthService();
