import mongoose from 'mongoose';
import { UserRole } from '../../enums/UserRole.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.CUSTOMER },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', userSchema);
