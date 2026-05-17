import { Router } from 'express';
import { verifyAuth, requireRole } from '../../common/middlewares/auth.middleware.js';
import { listEligible } from './coupon.controller.js';

const router = Router();

router.get('/', verifyAuth, requireRole('customer'), listEligible);

export default router;
