import mongoose from 'mongoose';
import { CHAT_TYPES } from '../modules/chat/chat.constants.js';

const chatSchema = new mongoose.Schema(
  {
    type: { type: String, enum: Object.values(CHAT_TYPES), required: true },
    name: { type: String, default: null, trim: true },
    avatar: { type: String, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // For DIRECT chats we store a sorted "directKey" of the two user ids for idempotent lookup.
    directKey: { type: String, default: null, index: true, sparse: true },
    lastMessageAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const ChatModel = mongoose.model('Chat', chatSchema);
