import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  screenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Screen', required: true },
  row: { type: String, required: true },
  seatNumber: { type: Number, required: true },
  type: { type: String, enum: ['normal', 'premium'], default: 'normal' },
  price: { type: Number, required: true },
  status: { type: String, enum: ['available', 'locked', 'booked', 'maintenance'], default: 'available' },
  lockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lockedAt: Date,
  lockExpiresAt: Date,
}, { timestamps: true });

seatSchema.index({ showId: 1, row: 1, seatNumber: 1 }, { unique: true });

export const Seat = mongoose.model('Seat', seatSchema);
