import mongoose from 'mongoose';
import { PAYMENT_STATUS, PAYMENT_METHOD } from '../../config/constants.js';

const paymentSchema = new mongoose.Schema(
  {
    ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true, unique: true },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: Object.values(PAYMENT_METHOD), required: true },
    status: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING },
    transactionRef: { type: String, default: null },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Payment = mongoose.model('Payment', paymentSchema);
