import mongoose from 'mongoose';

const requestLogSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, index: true },
    allowed: { type: Boolean, required: true },
    strategy: { type: String, required: true },
    endpoint: { type: String, default: '/' },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false },
);

export const RequestLogModel = mongoose.model('RequestLog', requestLogSchema);
