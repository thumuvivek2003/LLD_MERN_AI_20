import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true },
    type: { type: String, required: true, index: true },
    objectId: { type: String, default: null },
    objectLabel: { type: String, default: '' },
    payloadSummary: { type: String, default: '' },
    at: { type: Date, default: Date.now, index: true },
    status: { type: String, default: 'PROCESSED' },
  },
  { collection: 'eventlogs' },
);

export const EventLogModel = mongoose.model('EventLog', eventSchema);
