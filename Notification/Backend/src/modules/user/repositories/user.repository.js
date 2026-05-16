import { UserModel } from '../models/user.model.js';

export const userRepository = {
  async findById(id) {
    return UserModel.findById(id).lean();
  },

  async findAll() {
    return UserModel.find({}).sort({ createdAt: 1 }).lean();
  },

  async findManyByIds(ids) {
    return UserModel.find({ _id: { $in: ids } }).lean();
  },

  async updatePreferences(id, preferences) {
    return UserModel.findByIdAndUpdate(
      id,
      { $set: { preferences } },
      { new: true },
    ).lean();
  },

  async upsert(user) {
    return UserModel.findByIdAndUpdate(user._id, user, { upsert: true, new: true }).lean();
  },
};
