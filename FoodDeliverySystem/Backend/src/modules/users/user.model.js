import mongoose from 'mongoose';
import { ALL_ROLES, USER_ROLES } from '../../core/constants/roles.constants.js';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, trim: true },
    address: { type: String, trim: true },
    role: { type: String, enum: ALL_ROLES, default: USER_ROLES.CUSTOMER },
    isBlocked: { type: Boolean, default: false },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    rating: { type: Number, default: 4.5 },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', UserSchema);
