import mongoose from 'mongoose';
import { CHANNEL_TYPE_VALUES } from '../../../constants/channelType.constants.js';
import { EVENT_TYPE_VALUES } from '../../../constants/eventType.constants.js';

const versionSchema = new mongoose.Schema(
  {
    version: { type: Number, required: true },
    subjectTemplate: { type: String, default: '' },
    bodyTemplate: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const templateSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    eventType: { type: String, enum: EVENT_TYPE_VALUES, required: true },
    channel: { type: String, enum: CHANNEL_TYPE_VALUES, required: true },
    activeVersion: { type: Number, default: 1 },
    versions: { type: [versionSchema], default: [] },
  },
  { timestamps: true, _id: false },
);

templateSchema.index({ eventType: 1, channel: 1 });

export const TemplateSchema = templateSchema;
export const TemplateModel = mongoose.model('Template', templateSchema);
