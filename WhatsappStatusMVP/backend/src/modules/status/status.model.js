// modules/status/status.model.js
// Status is IMMUTABLE after creation (except deletion). Views live elsewhere.
import mongoose from 'mongoose';
import { PRIVACY, PRIVACY_VALUES } from '../../core/constants/privacy.constants.js';
import { DEFAULT_BACKGROUND } from './status.constants.js';

const statusSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true },
    background: { type: String, default: DEFAULT_BACKGROUND },
    privacy: { type: String, enum: PRIVACY_VALUES, default: PRIVACY.EVERYONE },
    includeUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // ONLY_SHARE_WITH
    excludeUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // CONTACTS_EXCEPT
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: false }
);

// (ownerId, expiresAt) → fetch a friend's active statuses fast (Step 13).
statusSchema.index({ ownerId: 1, expiresAt: 1 });
statusSchema.index({ createdAt: 1 });
// TTL index: Mongo auto-removes expired statuses (24h lifecycle, zero cron).
statusSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const StatusModel = mongoose.model('Status', statusSchema);
