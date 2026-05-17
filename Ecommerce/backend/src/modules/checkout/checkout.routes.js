import { Router } from 'express';
import { verifyAuth, requireRole } from '../../common/middlewares/auth.middleware.js';
import { checkout } from './checkout.controller.js';

const router = Router();

router.post('/', verifyAuth, requireRole('customer'), checkout);

export default router;
