import Transaction from '../models/transaction.model.js';

export const createTransaction = async (data) => {
  const transaction = new Transaction(data);
  return await transaction.save();
};

export const findActiveTransaction = async (userId, bookId) => {
  return await Transaction.findOne({
    user: userId,
    book: bookId,
    status: 'active'
  }).populate('book user issuedBy');
};

export const findTransactionById = async (id) => {
  return await Transaction.findById(id).populate('book user issuedBy');
};

export const findTransactionsByUser = async (userId) => {
  return await Transaction.find({ user: userId })
    .populate('book user issuedBy')
    .sort({ createdAt: -1 });
};

export const updateTransaction = async (id, data) => {
  return await Transaction.findByIdAndUpdate(id, data, { new: true })
    .populate('book user issuedBy');
};