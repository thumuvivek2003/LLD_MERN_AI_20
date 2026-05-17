import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';
import { authRepository } from './auth.repository.js';
import { loadEnvConfig } from '../../config/env.js';
import { AppError } from '../../shared/exceptions/AppError.js';
import { UnauthorizedError } from '../../shared/exceptions/UnauthorizedError.js';

const nanoIdAlpha = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 24);
const nanoIdNum = customAlphabet('0123456789', 4);

export function generateApiKey() {
  return `rl_${nanoIdAlpha()}`;
}

export function generateClientId() {
  return `user-${nanoIdNum()}`;
}

function signToken(client) {
  const { jwtSecret, jwtExpiresIn } = loadEnvConfig();
  return jwt.sign(
    { sub: client._id.toString(), role: client.role, clientId: client.clientId },
    jwtSecret,
    { expiresIn: jwtExpiresIn },
  );
}

function toUserDto(client) {
  return {
    id: client._id.toString(),
    username: client.username,
    role: client.role,
    clientId: client.clientId,
    apiKey: client.apiKey,
  };
}

export const authService = {
  async validateClient(username, password) {
    const client = await authRepository.findByUsername(username);
    if (!client) throw new UnauthorizedError('Invalid username or password');
    const ok = await bcrypt.compare(password, client.passwordHash);
    if (!ok) throw new UnauthorizedError('Invalid username or password');
    return client;
  },

  async login(username, password) {
    const client = await this.validateClient(username, password);
    const token = signToken(client);
    return { token, user: toUserDto(client) };
  },

  async register({ username, password, role = 'client', clientId, apiKey }) {
    const existing = await authRepository.findByUsername(username);
    if (existing) throw new AppError('Username already taken', 409, 'USERNAME_TAKEN');
    const passwordHash = await bcrypt.hash(password, 10);
    const client = await authRepository.createClient({
      username,
      passwordHash,
      role,
      clientId: clientId || generateClientId(),
      apiKey: apiKey || generateApiKey(),
    });
    const token = signToken(client);
    return { token, user: toUserDto(client) };
  },

  async me(userId) {
    const client = await authRepository.findById(userId);
    if (!client) throw new UnauthorizedError('User not found');
    return { user: toUserDto(client) };
  },

  verifyToken(token) {
    const { jwtSecret } = loadEnvConfig();
    try {
      return jwt.verify(token, jwtSecret);
    } catch (_err) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  },

  toUserDto,
};
