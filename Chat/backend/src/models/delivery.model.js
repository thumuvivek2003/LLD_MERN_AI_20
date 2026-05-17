import mongoose from 'mongoose';
import { MESSAGE_STATUS } from '../modules/delivery/delivery.constants.js';

/**
 * MessageStatus: one row per (message, recipient user) tracking SENT/DELIVERED/READ.
 */
const messageStatusSchema = new mongoose.Schema(
  {
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true, index: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: Object.values(MESSAGE_STATUS),
      default: MESSAGE_STATUS.SENT,
    },
    timestamp: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

messageStatusSchema.index({ messageId: 1, userId: 1 }, { unique: true });

export const MessageStatusModel = mongoose.model('MessageStatus', messageStatusSchema);
