import mongoose from 'mongoose';

const seatInfoSchema = new mongoose.Schema({
  seatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seat' },
  row: String,
  seatNumber: Number,
  type: String,
  price: Number,
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  seats: [seatInfoSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  bookingRef: { type: String, unique: true },
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);
