import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  screenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Screen', required: true },
  theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: String,
  basePrice: { type: Number, required: true },
  premiumPrice: Number,
  status: { type: String, enum: ['active', 'cancelled', 'completed'], default: 'active' },
}, { timestamps: true });

export const Show = mongoose.model('Show', showSchema);
