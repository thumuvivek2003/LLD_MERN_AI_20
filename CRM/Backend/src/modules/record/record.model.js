import mongoose from 'mongoose';
import { RECORD_STATUS } from '../../config/constants.js';

/**
 * The Record Store from main_flow.png. Values live under field IDs so a field
 * rename never touches a single record (chat.md's core argument).
 */
const recordSchema = new mongoose.Schema(
  {
    recordId: { type: String, required: true, unique: true, index: true },
    objectId: { type: String, required: true, index: true },
    recordJson: { type: mongoose.Schema.Types.Mixed, default: {} },
    displayName: { type: String, default: '' },
    status: { type: String, enum: Object.values(RECORD_STATUS), default: RECORD_STATUS.ACTIVE, index: true },
    objectVersion: { type: Number, default: 1 },
    createdBy: { type: String, default: 'u_system' },
    updatedBy: { type: String, default: 'u_system' },
  },
  { timestamps: true, collection: 'records', minimize: false },
);

recordSchema.index({ objectId: 1, status: 1 });
recordSchema.index({ objectId: 1, createdAt: -1 });

export const RecordModel = mongoose.model('Record', recordSchema);
