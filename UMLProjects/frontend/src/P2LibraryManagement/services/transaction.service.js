// services/transaction.service.js
import api from './api.js';

export const getUserTransactions = async (userId) => {
  const response = await api.get(`/transactions/user/${userId}`);
  return response.data;
};

export const getAllTransactions = async (params = {}) => {
  const response = await api.get('/transactions', { params });
  return response.data;
};

export const createTransaction = async (transactionData) => {
  const response = await api.post('/transactions', transactionData);
  return response.data;
};