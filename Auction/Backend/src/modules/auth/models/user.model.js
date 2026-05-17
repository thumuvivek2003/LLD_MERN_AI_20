import mongoose from 'mongoose';
import { ALL_ROLES, ROLES } from '../../../shared/constants/roles.constant.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ALL_ROLES, default: ROLES.MEMBER, index: true },
    walletBalance: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.password;
        return ret;
      },
    },
  },
);

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
