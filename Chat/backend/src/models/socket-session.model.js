import mongoose from 'mongoose';

/**
 * Persistent log of socket sessions. The live in-memory SocketManager
 * is the source of truth for routing; this is for auditability / future
 * multi-process scenarios.
 */
const socketSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    socketId: { type: String, required: true, index: true },
    connectedAt: { type: Date, default: () => new Date() },
    disconnectedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const SocketSessionModel = mongoose.model('SocketSession', socketSessionSchema);
