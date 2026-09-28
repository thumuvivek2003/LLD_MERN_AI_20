import mongoose from 'mongoose';

const versionSchema = new mongoose.Schema(
  {
    objectId: { type: String, required: true, index: true },
    version: { type: Number, required: true },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: String, default: 'u_admin' },
    summary: { type: String, default: '' },
    diff: { type: Array, default: [] },
  },
  { collection: 'objectversions' },
);

versionSchema.index({ objectId: 1, version: -1 });

export const ObjectVersionModel = mongoose.model('ObjectVersion', versionSchema);
