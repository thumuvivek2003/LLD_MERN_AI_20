import { AccountModel } from "../models/Account.model.js";
import { CardModel } from "../models/Card.model.js";

export async function findByCardNumber(cardNumber) {
  const card = await CardModel.findOne({ cardNumber });
  if (!card) return null;
  return AccountModel.findById(card.accountId);
}

export async function findById(accountId) {
  return AccountModel.findById(accountId);
}

export async function updateBalance(accountId, newBalance) {
  return AccountModel.findByIdAndUpdate(accountId, { balance: newBalance }, { new: true });
}

export async function incrementPinAttempts(cardNumber) {
  return CardModel.findOneAndUpdate(
    { cardNumber },
    { $inc: { pinAttempts: 1 } },
    { new: true }
  );
}
