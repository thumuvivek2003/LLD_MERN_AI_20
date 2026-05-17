import { UserModel } from '../../models/user.model.js';

export function findUsers() {
  return UserModel.find().sort({ createdAt: -1 }).lean();
}

export function findById(id) {
  return UserModel.findById(id).lean();
}

export function updateBlockStatus(id, isBlocked) {
  return UserModel.findByIdAndUpdate(id, { isBlocked }, { new: true }).lean();
}
