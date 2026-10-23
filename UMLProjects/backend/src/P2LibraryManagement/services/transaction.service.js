import * as transactionRepo from '../repositories/transaction.repo.js';
import Transaction from '../models/transaction.model.js';
import { getConfig } from '../config/env.js';

export const createTransaction = async (data) => {
  return await transactionRepo.createTransaction(data);
};

export const closeTransaction = async (transactionId, returnDate) => {
  const transaction = await transactionRepo.findTransactionById(transactionId);
  if (!transaction) {
    throw new Error('Transaction not found');
  }

  const fine = transaction.calculateFine(returnDate);
  return await transactionRepo.updateTransaction(transactionId, {
    returnDate,
    fine,
    status: 'returned'
  });
};

export const getTransactionsByUser = async (userId) => {
  return await transactionRepo.findTransactionsByUser(userId);
};

export const getAllTransactions = async () => {
  return await Transaction.find()
    .populate('book user issuedBy')
    .sort({ createdAt: -1 });
};

export const getActiveTransaction = async (userId, bookId) => {
  return await transactionRepo.findActiveTransaction(userId, bookId);
};

export const computeFine = (issueDate, returnDate) => {
  const config = getConfig();
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + config.borrowDurationDays);

  if (returnDate > dueDate) {
    const daysLate = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
    return daysLate * config.finePerDay;
  }
  return 0;
};