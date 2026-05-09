import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: { type: Number, required: true }, // minutes
  genre: [String],
  language: { type: String, default: 'English' },
  releaseDate: Date,
  posterUrl: String,
  bannerUrl: String,
  rating: { type: Number, default: 0, min: 0, max: 10 },
  cast: [String],
  director: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

movieSchema.index({ title: 'text' });

export const Movie = mongoose.model('Movie', movieSchema);
