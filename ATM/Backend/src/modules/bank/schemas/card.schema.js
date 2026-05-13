import mongoose from "mongoose";

export const cardSchema = new mongoose.Schema(
  {
    cardNumber: { type: String, required: true, unique: true, index: true },
    holderName: { type: String, required: true },
    bankCode: { type: String, required: true },
    pinHash: { type: String, required: true },
    pinAttempts: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  },
  { timestamps: true }
);
