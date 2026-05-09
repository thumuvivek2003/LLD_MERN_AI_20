const mongoose = require('mongoose');

const FINE_STATUS = Object.freeze({
  PENDING: 'PENDING',
  PAID: 'PAID',
});

const fineSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    borrowRecordId: { type: mongoose.Schema.Types.ObjectId, ref: 'BorrowRecord', required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    amount: { type: Number, required: true, min: 0 },
    daysOverdue: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: Object.values(FINE_STATUS),
      default: FINE_STATUS.PENDING,
    },
    paidDate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fine', fineSchema);
module.exports.FINE_STATUS = FINE_STATUS;
