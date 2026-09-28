import mongoose from 'mongoose';
import { FILTER_LOGIC } from '../../config/constants.js';

const viewSchema = new mongoose.Schema(
  {
    viewId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    objectId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    filters: { type: Array, default: [] },
    logic: { type: String, enum: Object.values(FILTER_LOGIC), default: FILTER_LOGIC.AND },
    sort: { type: mongoose.Schema.Types.Mixed, default: null },
    columns: { type: [String], default: [] },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'savedviews' },
);

export const SavedViewModel = mongoose.model('SavedView', viewSchema);
