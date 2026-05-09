import UserModel from '../models/UserModel.js';

export class UserRepository {
  async findById(id) {
    return UserModel.findById(id);
  }

  async findByEmail(email) {
    return UserModel.findOne({ email });
  }

  async create(data) {
    return UserModel.create(data);
  }

  async update(id, data) {
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  }

  async findAll() {
    return UserModel.find();
  }
}
