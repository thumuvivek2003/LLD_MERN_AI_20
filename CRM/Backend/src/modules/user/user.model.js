import mongoose from 'mongoose';
import { ROLE } from '../../config/constants.js';

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, enum: Object.values(ROLE), required: true },
    roleId: { type: String, required: true },
    avatarInitials: { type: String, default: '' },
    title: { type: String, default: '' },
  },
  { timestamps: true, collection: 'users' },
);

export const UserModel = mongoose.model('User', userSchema);
