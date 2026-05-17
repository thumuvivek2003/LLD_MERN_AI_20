import mongoose from 'mongoose';
import { GROUP_ROLES } from '../shared/constants/roles.constant.js';

const chatMemberSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, enum: Object.values(GROUP_ROLES), default: GROUP_ROLES.MEMBER },
    lastReadAt: { type: Date, default: null },
  },
  { timestamps: true }
);

chatMemberSchema.index({ chatId: 1, userId: 1 }, { unique: true });

export const ChatMemberModel = mongoose.model('ChatMember', chatMemberSchema);
