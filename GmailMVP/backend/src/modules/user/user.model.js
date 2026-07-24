import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatarColor: { type: String, default: '#6366f1' },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', UserSchema);
export default User;
