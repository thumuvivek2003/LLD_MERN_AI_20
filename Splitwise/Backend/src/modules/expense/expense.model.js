import mongoose from "mongoose";

const shareSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const expenseSchema = new mongoose.Schema(
  {
    expenseId: { type: String, required: true, unique: true, index: true },
    groupId: { type: String, required: true, index: true },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    paidBy: { type: String, required: true },
    splitType: { type: String, enum: ["EQUAL", "EXACT", "PERCENT"], required: true },
    participants: { type: [String], default: [] },
    shares: { type: [shareSchema], default: [] },
  },
  { timestamps: true }
);

export const ExpenseModel = mongoose.model("Expense", expenseSchema);

export function toExpenseDTO(doc) {
  if (!doc) return null;
  return {
    expenseId: doc.expenseId,
    groupId: doc.groupId,
    description: doc.description,
    amount: doc.amount,
    paidBy: doc.paidBy,
    splitType: doc.splitType,
    participants: [...(doc.participants || [])],
    shares: (doc.shares || []).map((s) => ({ userId: s.userId, amount: s.amount })),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
