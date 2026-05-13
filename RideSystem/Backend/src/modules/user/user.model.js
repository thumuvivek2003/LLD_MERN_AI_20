import mongoose from 'mongoose';
import { ROLES } from '../../config/constants.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    role: { type: String, enum: Object.values(ROLES), required: true },
    isBlocked: { type: Boolean, default: false },
    rating: { type: Number, default: 5 },
  },
  { timestamps: true },
);

userSchema.methods.toSafeJSON = function () {
  const { _id, name, email, phone, role, isBlocked, rating, createdAt } = this;
  return { id: _id, name, email, phone, role, isBlocked, rating, createdAt };
};

export const User = mongoose.model('User', userSchema);
