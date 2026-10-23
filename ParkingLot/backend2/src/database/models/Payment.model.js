import mongoose from 'mongoose';
import { PaymentStatus } from '../../enums/PaymentStatus.js';

const paymentSchema = new mongoose.Schema(
  {
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true, index: true },
    amount: { type: Number, required: true },
    method: { type: String },
    status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model('Payment', paymentSchema);
