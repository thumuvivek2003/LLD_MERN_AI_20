import mongoose from "mongoose";

const cashInventorySchema = new mongoose.Schema(
  {
    atmId: { type: String, required: true, unique: true, index: true, default: "ATM-1" },
    notes: {
      2000: { type: Number, default: 0 },
      500: { type: Number, default: 0 },
      200: { type: Number, default: 0 },
      100: { type: Number, default: 0 },
    },
  },
  { timestamps: true, minimize: false }
);

export const CashInventoryModel = mongoose.model("CashInventory", cashInventorySchema);
