import { UserModel } from '../../auth/models/user.model.js';

export const userRepository = {
  findById(id) {
    return UserModel.findById(id);
  },
  findManyByIds(ids) {
    return UserModel.find({ _id: { $in: ids } });
  },
  getUsers(filter = {}) {
    return UserModel.find(filter).sort({ createdAt: -1 });
  },
};
