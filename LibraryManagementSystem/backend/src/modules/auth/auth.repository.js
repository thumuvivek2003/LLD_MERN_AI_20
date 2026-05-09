const User = require('../../models/User');

class AuthRepository {
  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findById(id) {
    return User.findById(id);
  }

  async create(data) {
    return User.create(data);
  }

  async updateById(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async findAll(filter = {}, skip = 0, limit = 20) {
    return User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
  }

  async countAll(filter = {}) {
    return User.countDocuments(filter);
  }
}

module.exports = new AuthRepository();
