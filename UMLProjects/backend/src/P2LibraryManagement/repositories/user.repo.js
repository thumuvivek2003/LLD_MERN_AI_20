import User from '../models/user.model.js';

export const createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};

export const findUserById = async (id) => {
  return await User.findById(id).select('-password');
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};