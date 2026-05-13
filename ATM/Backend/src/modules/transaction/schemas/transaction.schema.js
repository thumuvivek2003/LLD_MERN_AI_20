import mongoose from "mongoose";
import { TRANSACTION_TYPE, TRANSACTION_STATUS } from "../../../core/constants/transaction.constants.js";

export const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: Object.values(TRANSACTION_TYPE), required: true },
    status: { type: String, enum: Object.values(TRANSACTION_STATUS), default: TRANSACTION_STATUS.STARTED },
    cardNumber: { type: String, required: true },
    bankCode: { type: String, required: true },
    amount: { type: Number, default: 0 },
    breakdown: { type: Object, default: {} },
    balanceAfter: { type: Number, default: null },
    failureReason: { type: String, default: null },
  },
  { timestamps: true }
);
