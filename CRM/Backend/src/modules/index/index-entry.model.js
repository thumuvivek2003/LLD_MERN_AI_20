import mongoose from 'mongoose';

/**
 * The persisted Index Store. One row per distinct key:
 *   { indexId, objectId, fieldId, key: "Hyderabad", recordIds: [...] }
 * The IndexManager mirrors these rows in memory at boot for query speed —
 * Mongo is durability, RAM is the query path.
 */
const indexEntrySchema = new mongoose.Schema(
  {
    indexId: { type: String, required: true, index: true },
    objectId: { type: String, required: true },
    fieldId: { type: String, required: true },
    key: { type: String, required: true },
    recordIds: { type: [String], default: [] },
  },
  { collection: 'indexentries' },
);

indexEntrySchema.index({ indexId: 1, key: 1 }, { unique: true });

export const IndexEntryModel = mongoose.model('IndexEntry', indexEntrySchema);
