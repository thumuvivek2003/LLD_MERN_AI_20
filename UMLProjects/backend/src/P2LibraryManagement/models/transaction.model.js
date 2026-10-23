import mongoose from 'mongoose';
import { getConfig } from '../config/env.js';

const TransactionSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  fine: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'returned', 'overdue'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

TransactionSchema.methods.calculateFine = function(returnDate) {
  const config = getConfig();
  if (returnDate > this.dueDate) {
    const daysLate = Math.ceil((returnDate - this.dueDate) / (1000 * 60 * 60 * 24));
    return daysLate * config.finePerDay;
  }
  return 0;
};

export default mongoose.model('Transaction', TransactionSchema);