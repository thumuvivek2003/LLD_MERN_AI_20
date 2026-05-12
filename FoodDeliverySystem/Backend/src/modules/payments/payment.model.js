import mongoose from 'mongoose';
import { PAYMENT_METHODS, PAYMENT_STATUS } from '../../core/constants/payment.constants.js';

const PaymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: Object.values(PAYMENT_METHODS), required: true },
    status: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING },
    transactionId: { type: String, default: null },
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model('Payment', PaymentSchema);
