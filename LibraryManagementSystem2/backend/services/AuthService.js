import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository.js';

const userRepository = new UserRepository();

export class AuthService {
  async register(name, email, password, role) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new Error('Email already in use');
    const hashed = await bcrypt.hash(password, 10);
    return userRepository.create({ name, email, password: hashed, role });
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    return { token, user };
  }
}
