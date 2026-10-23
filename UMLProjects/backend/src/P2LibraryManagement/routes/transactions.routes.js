import express from 'express';
import * as transactionController from '../controllers/transaction.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/user/:userId', authenticate, transactionController.getUserTransactions);
router.get('/', authenticate, authorize(['admin', 'librarian']), transactionController.getAllTransactions);

export default router;