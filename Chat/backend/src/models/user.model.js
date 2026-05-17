import mongoose from 'mongoose';
import { ROLES } from '../shared/constants/roles.constant.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, unique: true, index: true, trim: true },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.USER },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', userSchema);
