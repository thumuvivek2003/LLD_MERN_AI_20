import { UserModel } from '../../models/user.model.js';

export async function updatePresence(userId, { isOnline }) {
  const update = { isOnline };
  if (!isOnline) update.lastSeen = new Date();
  return UserModel.findByIdAndUpdate(userId, update, { new: true }).lean();
}

export function getOnlineUsers() {
  return UserModel.find({ isOnline: true }).lean();
}
