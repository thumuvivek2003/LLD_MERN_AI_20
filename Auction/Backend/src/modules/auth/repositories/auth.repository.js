import { UserModel } from '../models/user.model.js';

export const authRepository = {
  findByEmail(email) {
    return UserModel.findOne({ email: email.toLowerCase() });
  },
  findById(id) {
    return UserModel.findById(id);
  },
  create(data) {
    return UserModel.create(data);
  },
  countAdmins() {
    return UserModel.countDocuments({ role: 'ADMIN' });
  },
};
