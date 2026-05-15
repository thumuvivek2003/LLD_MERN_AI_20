import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema(
  {
    settlementId: { type: String, required: true, unique: true, index: true },
    groupId: { type: String, required: true, index: true },
    fromUserId: { type: String, required: true },
    toUserId: { type: String, required: true },
    amount: { type: Number, required: true },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export const SettlementModel = mongoose.model("Settlement", settlementSchema);

export function toSettlementDTO(doc) {
  if (!doc) return null;
  return {
    settlementId: doc.settlementId,
    groupId: doc.groupId,
    fromUserId: doc.fromUserId,
    toUserId: doc.toUserId,
    amount: doc.amount,
    note: doc.note || "",
    createdAt: doc.createdAt,
  };
}
