import mongoose from 'mongoose';
import { UserRole } from '../enums/UserRole.js';
import { UserStatus } from '../enums/UserStatus.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.MEMBER },
  status: { type: String, enum: Object.values(UserStatus), default: UserStatus.ACTIVE },
  isPremium: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
