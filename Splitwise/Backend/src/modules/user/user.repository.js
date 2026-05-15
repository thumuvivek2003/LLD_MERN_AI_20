import { UserModel } from "./user.model.js";

export async function createUser(data) {
  return UserModel.create(data);
}

export async function findUserById(userId) {
  return UserModel.findOne({ userId });
}

export async function findUserByEmail(email) {
  return UserModel.findOne({ email: String(email).toLowerCase().trim() });
}

export async function findUsersByIds(userIds) {
  return UserModel.find({ userId: { $in: userIds } });
}

export async function listUsers() {
  return UserModel.find().sort({ createdAt: 1 });
}
