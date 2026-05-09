import mongoose from 'mongoose';
import { RequestStatus } from '../enums/RequestStatus.js';

const borrowRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  status: { type: String, enum: Object.values(RequestStatus), default: RequestStatus.PENDING },
  borrowDate: { type: Date },
  dueDate: { type: Date },
  returnDate: { type: Date },
}, { timestamps: true });

export default mongoose.model('BorrowRequest', borrowRequestSchema);
