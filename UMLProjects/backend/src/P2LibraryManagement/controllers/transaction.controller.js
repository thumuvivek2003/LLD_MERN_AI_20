import * as transactionService from '../services/transaction.service.js';
import { success, error } from '../utils/responses.js';

export const getUserTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getTransactionsByUser(req.params.userId);
    success(res, transactions, 'Transactions fetched successfully');
  } catch (err) {
    error(res, err.message, 400);
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    success(res, transactions, 'Transactions fetched successfully');
  } catch (err) {
    error(res, err.message, 400);
  }
};

export const createTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.createTransaction(req.body);
    success(res, transaction, 'Transaction created successfully', 201);
  } catch (err) {
    error(res, err.message, 400);
  }
};