// modules/view/view.model.js — StatusView collection.
// Immutable insert-only records. We NEVER mutate the Status when someone views
// it (avoids the "5M viewers on one doc" hotspot — Step 3 of the design notes).
import mongoose from 'mongoose';

const statusViewSchema = new mongoose.Schema(
  {
    statusId: { type: mongoose.Schema.Types.ObjectId, ref: 'Status', required: true },
    viewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    viewedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// (viewerId, statusId) → "have I seen this?" in milliseconds (Step 13).
statusViewSchema.index({ viewerId: 1, statusId: 1 }, { unique: true });
// statusId → "who viewed my status?" for the viewers list.
statusViewSchema.index({ statusId: 1 });

export const StatusViewModel = mongoose.model('StatusView', statusViewSchema);
