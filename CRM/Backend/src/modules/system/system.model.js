import mongoose from 'mongoose';
import { LOG_LEVEL } from '../../config/constants.js';

const logSchema = new mongoose.Schema(
  {
    logId: { type: String, required: true, unique: true },
    at: { type: Date, default: Date.now, index: true },
    level: { type: String, enum: Object.values(LOG_LEVEL), default: LOG_LEVEL.INFO, index: true },
    source: { type: String, default: 'app' },
    message: { type: String, default: '' },
  },
  { collection: 'systemlogs' },
);

const alertSchema = new mongoose.Schema(
  {
    alertId: { type: String, required: true, unique: true },
    severity: { type: String, default: 'INFO' },
    title: { type: String, default: '' },
    message: { type: String, default: '' },
    at: { type: Date, default: Date.now },
    acknowledged: { type: Boolean, default: false },
  },
  { collection: 'alerts' },
);

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'global' },
    indexingMode: { type: String, enum: ['SYNC', 'ASYNC'], default: 'ASYNC' },
    cacheTtlSeconds: { type: Number, default: 300 },
    auditRetentionDays: { type: Number, default: 90 },
    maxBulkSize: { type: Number, default: 500 },
    featureFlags: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({ savedViews: true, importExport: true, lookupGraph: true, geoIndex: false }),
    },
  },
  { timestamps: true, collection: 'systemsettings', minimize: false },
);

export const SystemLogModel = mongoose.model('SystemLog', logSchema);
export const AlertModel = mongoose.model('Alert', alertSchema);
export const SystemSettingModel = mongoose.model('SystemSetting', settingSchema);
