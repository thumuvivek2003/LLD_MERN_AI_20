import { walletRepository } from '../repositories/wallet.repository.js';
import { ValidationError, DomainRuleError } from '../../../shared/errors/validation.error.js';

export const walletService = {
  async getBalance(userId) {
    const doc = await walletRepository.findWallet(userId);
    return doc?.walletBalance ?? 0;
  },

  async creditBalance(userId, amount) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new ValidationError('Top-up amount must be a positive number');
    }
    const doc = await walletRepository.updateBalance(userId, amount);
    return doc.walletBalance;
  },

  async debitBalance(userId, amount) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new ValidationError('Debit amount must be a positive number');
    }
    const doc = await walletRepository.updateBalance(userId, -amount);
    if (!doc) throw new DomainRuleError('Insufficient wallet balance');
    return doc.walletBalance;
  },
};
