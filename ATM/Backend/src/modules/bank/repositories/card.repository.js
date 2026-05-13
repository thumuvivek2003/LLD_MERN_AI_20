import { CardModel } from "../models/Card.model.js";

export async function findCard(cardNumber) {
  return CardModel.findOne({ cardNumber });
}

export async function blockCard(cardNumber) {
  return CardModel.findOneAndUpdate(
    { cardNumber },
    { isBlocked: true },
    { new: true }
  );
}

export async function resetPinAttempts(cardNumber) {
  return CardModel.findOneAndUpdate(
    { cardNumber },
    { pinAttempts: 0 },
    { new: true }
  );
}

export async function incrementPinAttempts(cardNumber) {
  return CardModel.findOneAndUpdate(
    { cardNumber },
    { $inc: { pinAttempts: 1 } },
    { new: true }
  );
}
