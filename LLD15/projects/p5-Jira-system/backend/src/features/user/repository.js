import User from "./model.js";

export const createUserRepo = (data) => User.create(data);

export const findUserByEmail = (email) =>
  User.findOne({ email });

export const findUserById = (id) =>
  User.findById(id);

export const updatePasswordRepo = (userId, password) =>
  User.findByIdAndUpdate(userId, { password }, { new: true });