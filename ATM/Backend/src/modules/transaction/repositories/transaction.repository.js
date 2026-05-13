import { TransactionModel } from "../models/Transaction.model.js";

export async function createTransaction(data) {
  return TransactionModel.create(data);
}

export async function updateTransactionStatus(transactionId, status, extra = {}) {
  return TransactionModel.findOneAndUpdate(
    { transactionId },
    { status, ...extra },
    { new: true }
  );
}

export async function getTransactions(filter = {}, limit = 20) {
  return TransactionModel.find(filter).sort({ createdAt: -1 }).limit(limit);
}

export async function findById(transactionId) {
  return TransactionModel.findOne({ transactionId });
}
