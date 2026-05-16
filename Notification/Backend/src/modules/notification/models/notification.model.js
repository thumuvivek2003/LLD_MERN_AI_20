import mongoose from 'mongoose';
import { CHANNEL_TYPE_VALUES } from '../../../constants/channelType.constants.js';
import { NOTIFICATION_STATUS, NOTIFICATION_STATUS_VALUES } from '../../../constants/notificationStatus.constants.js';
import { EVENT_TYPE_VALUES } from '../../../constants/eventType.constants.js';

const attemptSchema = new mongoose.Schema(
  {
    at: { type: Date, default: Date.now },
    status: { type: String, enum: NOTIFICATION_STATUS_VALUES, required: true },
    error: { type: String, default: null },
  },
  { _id: false },
);

const notificationSchema = new mongoose.Schema(
  {
    _id: { type: String },
    userId: { type: String, required: true },
    eventId: { type: String, default: null },
    groupId: { type: String, default: null },
    eventType: { type: String, enum: EVENT_TYPE_VALUES, default: 'CUSTOM' },
    channel: { type: String, enum: CHANNEL_TYPE_VALUES, required: true },
    templateId: { type: String, default: null },
    templateVersion: { type: Number, default: null },
    payloadSnapshot: { type: mongoose.Schema.Types.Mixed, default: {} },
    // Optional custom override (used when admin sends without a template).
    customSubject: { type: String, default: null },
    customBody: { type: String, default: null },
    status: { type: String, enum: NOTIFICATION_STATUS_VALUES, default: NOTIFICATION_STATUS.QUEUED },
    retryCount: { type: Number, default: 0 },
    attempts: { type: [attemptSchema], default: [] },
    lastError: { type: String, default: null },
  },
  { timestamps: true, _id: false },
);

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ status: 1, createdAt: -1 });
notificationSchema.index({ channel: 1, createdAt: -1 });
notificationSchema.index({ eventType: 1, createdAt: -1 });

export const NotificationSchema = notificationSchema;
export const NotificationModel = mongoose.model('Notification', notificationSchema);
