import mongoose from 'mongoose';

const { Schema } = mongoose;

const ThreadSchema = new Schema(
  {
    subject: { type: String, default: '' },
    mailIds: [{ type: Schema.Types.ObjectId, ref: 'Mail' }],
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Thread = mongoose.model('Thread', ThreadSchema);
export default Thread;
