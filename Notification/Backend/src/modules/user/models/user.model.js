import mongoose from 'mongoose';

const preferenceSchema = new mongoose.Schema(
  {
    emailEnabled: { type: Boolean, default: true },
    smsEnabled: { type: Boolean, default: true },
    pushEnabled: { type: Boolean, default: true },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    _id: { type: String }, // human-friendly ids (u1, u2, u_admin)
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    pushToken: { type: String, default: '' },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    preferences: { type: preferenceSchema, default: () => ({}) },
  },
  { timestamps: true, _id: false },
);

export const UserSchema = userSchema;
export const UserModel = mongoose.model('User', userSchema);
