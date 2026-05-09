const mongoose = require('mongoose');

const BORROW_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  OVERDUE: 'OVERDUE',
  RETURNED: 'RETURNED',
});

const borrowRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
    borrowDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date, default: null },
    status: {
      type: String,
      enum: Object.values(BORROW_STATUS),
      default: BORROW_STATUS.ACTIVE,
    },
    fineAmount: { type: Number, default: 0 },
    finePaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

borrowRecordSchema.methods.isOverdue = function () {
  return this.status !== BORROW_STATUS.RETURNED && new Date() > this.dueDate;
};

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);
module.exports.BORROW_STATUS = BORROW_STATUS;
