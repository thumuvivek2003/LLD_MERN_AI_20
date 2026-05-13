import bcrypt from 'bcryptjs';
import { authRepository } from './auth.repository.js';
import { signToken } from '../../core/utils/jwt.util.js';
import { AppError } from '../../core/exceptions/app.error.js';
import { AuthError } from '../../core/exceptions/auth.error.js';
import { driverService } from '../driver/driver.service.js';
import { ROLES } from '../../config/constants.js';

class AuthService {
  async register({ name, email, password, phone, role }) {
    const existing = await authRepository.findByEmail(email);
    if (existing) throw new AppError('Email already registered', 409);

    const hash = await bcrypt.hash(password, 10);
    const user = await authRepository.create({ name, email, password: hash, phone, role });

    if (role === ROLES.DRIVER) {
      await driverService.ensureDriverProfile(user._id);
    }

    return this.#issue(user);
  }

  async login({ email, password }) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new AuthError('Invalid credentials');
    if (user.isBlocked) throw new AuthError('Account blocked');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new AuthError('Invalid credentials');

    return this.#issue(user);
  }

  #issue(user) {
    const token = signToken({ id: String(user._id), role: user.role, email: user.email });
    return { user, token };
  }
}

export const authService = new AuthService();
