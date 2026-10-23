import { UserModel } from '../database/models/User.model.js';

export class UserRepository {
  async create(data) {
    const user = await UserModel.create(data);
    return user.toObject();
  }

  async findByEmail(email) {
    return UserModel.findOne({ email }).lean();
  }

  async findById(id) {
    return UserModel.findById(id).lean();
  }
}
