const jwt = require('jsonwebtoken');
const ApiError = require('../../utils/ApiError');
const authRepository = require('./auth.repository');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

class AuthService {
  async register(name, email, password, role = 'user', phone) {
    const existing = await authRepository.findByEmail(email);
    if (existing) throw new ApiError(409, 'Email already registered.');

    const user = await authRepository.create({ name, email, password, role, phone });
    const token = signToken(user._id);
    return { user, token };
  }

  async login(email, password) {
    const user = await authRepository.findByEmail(email);
    if (!user || !user.isActive) throw new ApiError(401, 'Invalid credentials.');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(401, 'Invalid credentials.');

    const token = signToken(user._id);
    return { user, token };
  }

  async getProfile(userId) {
    const user = await authRepository.findById(userId);
    if (!user) throw new ApiError(404, 'User not found.');
    return user;
  }

  async updateProfile(userId, data) {
    const allowed = ['name', 'phone'];
    const update = Object.fromEntries(
      Object.entries(data).filter(([k]) => allowed.includes(k))
    );
    const user = await authRepository.updateById(userId, update);
    if (!user) throw new ApiError(404, 'User not found.');
    return user;
  }

  async getAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      authRepository.findAll({}, skip, limit),
      authRepository.countAll(),
    ]);
    return { users, total, page, pages: Math.ceil(total / limit) };
  }

  async toggleUserStatus(userId) {
    const user = await authRepository.findById(userId);
    if (!user) throw new ApiError(404, 'User not found.');
    user.isActive = !user.isActive;
    await user.save();
    return user;
  }
}

module.exports = new AuthService();
