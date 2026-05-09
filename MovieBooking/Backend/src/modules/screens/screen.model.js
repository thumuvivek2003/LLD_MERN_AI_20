import mongoose from 'mongoose';

const rowConfigSchema = new mongoose.Schema({
  row: String,
  type: { type: String, enum: ['normal', 'premium'], default: 'normal' },
  seats: Number,
}, { _id: false });

const screenSchema = new mongoose.Schema({
  theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  name: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  rows: { type: Number, required: true },
  seatsPerRow: { type: Number, required: true },
  seatLayout: [rowConfigSchema],
}, { timestamps: true });

export const Screen = mongoose.model('Screen', screenSchema);
