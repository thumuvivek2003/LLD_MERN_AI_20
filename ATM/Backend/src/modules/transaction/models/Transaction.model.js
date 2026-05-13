import mongoose from "mongoose";
import { transactionSchema } from "../schemas/transaction.schema.js";

export const TransactionModel = mongoose.model("Transaction", transactionSchema);
