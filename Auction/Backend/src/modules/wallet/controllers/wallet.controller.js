import { z } from 'zod';
import { walletService } from '../services/wallet.service.js';
import { successResponse } from '../../../shared/utils/response.util.js';

const topUpSchema = z.object({ amount: z.number().positive() });

export const walletController = {
  async getWalletBalance(req, res, next) {
    try {
      const balance = await walletService.getBalance(req.user.id);
      return successResponse(res, { balance });
    } catch (err) {
      next(err);
    }
  },

  async topUpWallet(req, res, next) {
    try {
      const { amount } = topUpSchema.parse(req.body);
      const balance = await walletService.creditBalance(req.user.id, amount);
      return successResponse(res, { balance });
    } catch (err) {
      next(err);
    }
  },
};
