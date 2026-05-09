import mongoose from 'mongoose';
import { FineStatus } from '../enums/FineStatus.js';

const fineSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  borrowRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'BorrowRequest', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: Object.values(FineStatus), default: FineStatus.PENDING },
  paidAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Fine', fineSchema);
