import { UserModel } from '../../models/user.model.js';

export function findById(id) {
  return UserModel.findById(id).lean();
}

export function findByMobile(mobile) {
  return UserModel.findOne({ mobile }).lean();
}

export function findAll(filter = {}) {
  return UserModel.find(filter).sort({ createdAt: -1 }).lean();
}

export function findAllExcept(userId) {
  return UserModel.find({ _id: { $ne: userId }, isBlocked: { $ne: true } })
    .sort({ name: 1 })
    .lean();
}

export function updateLastSeen(userId, when = new Date()) {
  return UserModel.findByIdAndUpdate(
    userId,
    { isOnline: false, lastSeen: when },
    { new: true }
  ).lean();
}

export function updateName(userId, name) {
  return UserModel.findByIdAndUpdate(userId, { name }, { new: true }).lean();
}

export function setOnlineStatus(userId, isOnline) {
  const update = { isOnline };
  if (!isOnline) update.lastSeen = new Date();
  return UserModel.findByIdAndUpdate(userId, update, { new: true }).lean();
}

export function setBlocked(userId, isBlocked) {
  return UserModel.findByIdAndUpdate(userId, { isBlocked }, { new: true }).lean();
}

export function countAll() {
  return UserModel.countDocuments();
}

export function countOnline() {
  return UserModel.countDocuments({ isOnline: true });
}
