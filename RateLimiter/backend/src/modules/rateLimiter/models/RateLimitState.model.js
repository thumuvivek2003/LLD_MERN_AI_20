import mongoose from 'mongoose';

const rateLimitStateSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, unique: true, index: true },
    strategyType: { type: String, required: true },
    requestCount: { type: Number, default: 0 },
    windowStart: { type: Number, default: 0 },
    timestamps: { type: [Number], default: [] },
    tokens: { type: Number, default: 0 },
    lastRefill: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const RateLimitStateModel = mongoose.model('RateLimitState', rateLimitStateSchema);
