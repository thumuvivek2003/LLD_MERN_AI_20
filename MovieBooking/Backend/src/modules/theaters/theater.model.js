import mongoose from 'mongoose';

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: String,
  totalScreens: { type: Number, default: 0 },
}, { timestamps: true });

export const Theater = mongoose.model('Theater', theaterSchema);
