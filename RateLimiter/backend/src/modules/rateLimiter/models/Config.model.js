import mongoose from 'mongoose';

const configSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'global' },
    strategyType: { type: String, required: true, default: 'FIXED_WINDOW' },
    maxRequests: { type: Number, default: 5 },
    windowSeconds: { type: Number, default: 60 },
    capacity: { type: Number, default: 10 },
    refillRatePerSec: { type: Number, default: 1 },
  },
  { timestamps: true },
);

export const ConfigModel = mongoose.model('Config', configSchema);
