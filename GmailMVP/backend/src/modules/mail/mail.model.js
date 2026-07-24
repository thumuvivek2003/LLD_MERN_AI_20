import mongoose from 'mongoose';
import { MAIL_STATUS } from '../../shared/constants/mail-status.constant.js';

const { Schema } = mongoose;

const MailSchema = new Schema(
  {
    threadId: { type: Schema.Types.ObjectId, ref: 'Thread', required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    receivers: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
    subject: { type: String, default: '' },
    body: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now, index: true },
    status: {
      type: String,
      enum: Object.values(MAIL_STATUS),
      default: MAIL_STATUS.SENT,
    },
    // Users who have opened/read this mail.
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Mail = mongoose.model('Mail', MailSchema);
export default Mail;
