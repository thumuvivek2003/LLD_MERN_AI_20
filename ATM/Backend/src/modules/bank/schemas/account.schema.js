import mongoose from "mongoose";

export const accountSchema = new mongoose.Schema(
  {
    accountNumber: { type: String, required: true, unique: true, index: true },
    holderName: { type: String, required: true },
    bankCode: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);
