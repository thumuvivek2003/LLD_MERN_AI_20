import { ExpenseModel } from "./expense.model.js";

export async function createExpense(data) {
  return ExpenseModel.create(data);
}

export async function findExpenseById(expenseId) {
  return ExpenseModel.findOne({ expenseId });
}

export async function findExpensesByGroup(groupId) {
  return ExpenseModel.find({ groupId }).sort({ createdAt: -1 });
}

export async function saveExpense(doc) {
  return doc.save();
}

export async function deleteExpense(expenseId) {
  return ExpenseModel.deleteOne({ expenseId });
}
