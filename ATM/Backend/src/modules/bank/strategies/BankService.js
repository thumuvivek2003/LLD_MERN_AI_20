import * as cardRepo from "../repositories/card.repository.js";
import * as accountRepo from "../repositories/account.repository.js";
import { getMaxPinAttempts } from "../../../config/atm.config.js";
import { AuthenticationError } from "../../../core/errors/AuthenticationError.js";
import { CardBlockedError } from "../../../core/errors/CardBlockedError.js";
import { InsufficientBalanceError } from "../../../core/errors/InsufficientBalanceError.js";

export class BankService {
  constructor(bankCode, bankName) {
    this.bankCode = bankCode;
    this.bankName = bankName;
  }

  async authenticate(cardNumber, pin) {
    const card = await cardRepo.findCard(cardNumber);
    if (!card) throw new AuthenticationError("Card not found");
    if (card.isBlocked) throw new CardBlockedError();

    if (card.pinHash === pin) {
      await cardRepo.resetPinAttempts(cardNumber);
      return { success: true, attemptsLeft: getMaxPinAttempts() };
    }

    const updated = await cardRepo.incrementPinAttempts(cardNumber);
    const max = getMaxPinAttempts();
    const attemptsLeft = Math.max(max - updated.pinAttempts, 0);

    if (updated.pinAttempts >= max) {
      await cardRepo.blockCard(cardNumber);
      throw new CardBlockedError();
    }
    throw new AuthenticationError("Incorrect PIN", "WRONG_PIN", { attemptsLeft });
  }

  async checkBalance(cardNumber) {
    const account = await accountRepo.findByCardNumber(cardNumber);
    if (!account) throw new AuthenticationError("Account not found");
    return account.balance;
  }

  async withdraw(cardNumber, amount) {
    const account = await accountRepo.findByCardNumber(cardNumber);
    if (!account) throw new AuthenticationError("Account not found");
    if (account.balance < amount) throw new InsufficientBalanceError();
    const newBalance = account.balance - amount;
    await accountRepo.updateBalance(account._id, newBalance);
    return newBalance;
  }
}
