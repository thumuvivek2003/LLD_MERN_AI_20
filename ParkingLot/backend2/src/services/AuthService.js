import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { appConfig } from '../config/app.config.js';

export class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register({ name, email, password, role }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new Error('Email already registered');
    const passwordHash = await bcrypt.hash(password, 10);
    return this.userRepository.create({ name, email, passwordHash, role });
  }

  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error('Invalid credentials');
    const token = jwt.sign({ id: user._id, role: user.role }, appConfig.jwtSecret, {
      expiresIn: appConfig.jwtExpiresIn,
    });
    return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
  }

  verify(token) {
    return jwt.verify(token, appConfig.jwtSecret);
  }
}
