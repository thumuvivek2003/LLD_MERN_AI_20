import { Router } from 'express';
import { walletController } from '../controllers/wallet.controller.js';
import { authenticate } from '../../../shared/middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, walletController.getWalletBalance);
router.post('/topup', authenticate, walletController.topUpWallet);

export default router;
