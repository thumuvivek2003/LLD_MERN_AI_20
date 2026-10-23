import { db } from '../../../config/db.config.js';
import { BaseRepository } from '../../../shared/database/base.repository.js';
import { AppError } from '../../../shared/exceptions/app-error.js';
import { User } from '../models/user.model.js';

const userRepo = new BaseRepository(db.users);

const encodeToken = (payload) =>
  Buffer.from(JSON.stringify(payload)).toString('base64');

export const decodeToken = (token) => {
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
  } catch {
    return null;
  }
};

export class AuthService {
  login(username, password) {
    const user = userRepo.findOne((u) => u.username === username);
    if (!user || user.password !== password) {
      throw new AppError('Invalid credentials', 401);
    }
    const payload = { id: user.id, username: user.username, role: user.role, parkingLotId: user.parkingLotId };
    return { token: encodeToken(payload), user: payload };
  }

  createUser(dto) {
    if (userRepo.findOne((u) => u.username === dto.username)) {
      throw new AppError('username already exists', 409);
    }
    return userRepo.create(new User(dto));
  }

  assignToLot(userId, parkingLotId) {
    const user = userRepo.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return userRepo.update(userId, { parkingLotId });
  }

  list() {
    return userRepo.findAll().map(({ password, ...rest }) => rest);
  }
}

export const authService = new AuthService();
