import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    apiKey: { type: String, required: true, unique: true, index: true },
    role: { type: String, enum: ['admin', 'client'], default: 'client' },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
    lastSeen: { type: Date, default: null },
  },
  { timestamps: true },
);

export const ClientModel = mongoose.model('Client', clientSchema);
