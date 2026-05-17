import { UserModel } from '../../models/user.model.js';

export function findUserByMobile(mobile) {
  return UserModel.findOne({ mobile }).lean();
}

export async function createUser({ name, mobile, role }) {
  const created = await UserModel.create({ name, mobile, role });
  return created.toObject();
}
