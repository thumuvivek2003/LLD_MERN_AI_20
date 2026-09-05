// modules/user/user.model.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String, default: '' }, // URL or emoji/initial seed
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', userSchema);
