import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../user/user.repository.js';
import { getAppConfig } from '../../config/app.config.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { UnauthorizedError } from '../../common/errors/UnauthorizedError.js';

export class AuthService {
  constructor(repo = userRepository) {
    this.repo = repo;
    this.config = getAppConfig();
  }

  _signToken(user) {
    return jwt.sign({ _id: user._id, role: user.role }, this.config.jwtSecret, {
      expiresIn: this.config.jwtExpiresIn,
    });
  }

  async registerUser({ name, email, password, role }) {
    const exists = await this.repo.findByEmail(email);
    if (exists) throw new ValidationError('Email already registered', 'EMAIL_TAKEN');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.repo.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role === 'admin' ? 'admin' : 'customer',
    });
    return { token: this._signToken(user), user: user.toSafeJSON() };
  }

  async loginUser({ email, password }) {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');
    if (user.blocked) throw new UnauthorizedError('Account is blocked', 'ACCOUNT_BLOCKED');
    const ok = await user.comparePassword(password);
    if (!ok) throw new UnauthorizedError('Invalid credentials');
    return { token: this._signToken(user), user: user.toSafeJSON() };
  }
}

export const authService = new AuthService();
