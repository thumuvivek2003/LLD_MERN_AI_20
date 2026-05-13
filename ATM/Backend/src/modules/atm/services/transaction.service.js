import * as txnRepo from "../../transaction/repositories/transaction.repository.js";
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../../core/constants/transaction.constants.js";
import { generateTransactionId } from "../../../core/utils/transaction.util.js";

export async function startTransaction({ type, cardNumber, bankCode, amount = 0 }) {
  return txnRepo.createTransaction({
    transactionId: generateTransactionId(),
    type,
    status: TRANSACTION_STATUS.STARTED,
    cardNumber,
    bankCode,
    amount,
  });
}

export async function completeTransaction(transactionId, { breakdown, balanceAfter }) {
  return txnRepo.updateTransactionStatus(transactionId, TRANSACTION_STATUS.COMPLETED, {
    breakdown,
    balanceAfter,
  });
}

export async function markCollected(transactionId) {
  return txnRepo.updateTransactionStatus(transactionId, TRANSACTION_STATUS.COLLECTED);
}

export async function failTransaction(transactionId, reason) {
  return txnRepo.updateTransactionStatus(transactionId, TRANSACTION_STATUS.FAILED, {
    failureReason: reason,
  });
}

export { TRANSACTION_TYPE };
