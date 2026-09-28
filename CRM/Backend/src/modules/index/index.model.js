import mongoose from 'mongoose';
import { INDEX_TYPE, INDEX_STATUS } from '../../config/constants.js';

const historySchema = new mongoose.Schema(
  { at: { type: Date, default: Date.now }, action: String, docCount: Number, ms: Number },
  { _id: false },
);

const indexSchema = new mongoose.Schema(
  {
    indexId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    objectId: { type: String, required: true, index: true },
    fieldId: { type: String, required: true },
    type: { type: String, enum: Object.values(INDEX_TYPE), required: true },
    status: { type: String, enum: Object.values(INDEX_STATUS), default: INDEX_STATUS.INACTIVE, index: true },
    docCount: { type: Number, default: 0 },
    keyCount: { type: Number, default: 0 },
    sizeBytes: { type: Number, default: 0 },
    health: { type: Number, default: 100 },
    lastBuiltAt: { type: Date, default: null },
    buildMs: { type: Number, default: 0 },
    history: { type: [historySchema], default: [] },
    performance: {
      hits: { type: Number, default: 0 },
      misses: { type: Number, default: 0 },
      queryCount: { type: Number, default: 0 },
      totalQueryMs: { type: Number, default: 0 },
    },
  },
  { timestamps: true, collection: 'indexdefinitions' },
);

indexSchema.index({ objectId: 1, fieldId: 1 }, { unique: true });

export const IndexDefinitionModel = mongoose.model('IndexDefinition', indexSchema);
