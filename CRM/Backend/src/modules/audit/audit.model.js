import mongoose from 'mongoose';
import { AUDIT_ACTION } from '../../config/constants.js';

const changeSchema = new mongoose.Schema(
  {
    fieldId: String,
    label: String,
    from: mongoose.Schema.Types.Mixed,
    to: mongoose.Schema.Types.Mixed,
  },
  { _id: false },
);

const auditSchema = new mongoose.Schema(
  {
    auditId: { type: String, required: true, unique: true },
    at: { type: Date, default: Date.now, index: true },
    userId: { type: String, index: true },
    userName: { type: String, default: '' },
    action: { type: String, enum: Object.values(AUDIT_ACTION), index: true },
    objectId: { type: String, index: true },
    objectLabel: { type: String, default: '' },
    recordId: { type: String, default: null, index: true },
    recordDisplayName: { type: String, default: '' },
    summary: { type: String, default: '' },
    changes: { type: [changeSchema], default: [] },
  },
  { collection: 'auditlogs' },
);

auditSchema.index({ objectId: 1, at: -1 });

export const AuditLogModel = mongoose.model('AuditLog', auditSchema);
