import { Router } from 'express';
import { processPayment } from './payment.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.post('/process', authenticate, processPayment);

export default router;
