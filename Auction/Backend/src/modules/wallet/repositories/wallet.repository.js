import { WalletModel } from '../models/wallet.model.js';

export const walletRepository = {
  findWallet(userId) {
    return WalletModel.findById(userId).select('walletBalance');
  },

  // Atomic increment/decrement. Pass negative delta to debit.
  async updateBalance(userId, delta) {
    if (delta < 0) {
      // guard: refuse if it would go negative (atomic check via filter)
      const doc = await WalletModel.findOneAndUpdate(
        { _id: userId, walletBalance: { $gte: -delta } },
        { $inc: { walletBalance: delta } },
        { new: true },
      );
      return doc;
    }
    return WalletModel.findByIdAndUpdate(userId, { $inc: { walletBalance: delta } }, { new: true });
  },
};
