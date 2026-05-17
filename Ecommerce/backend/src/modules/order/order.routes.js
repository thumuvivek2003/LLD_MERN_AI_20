import { Router } from 'express';
import { verifyAuth, requireRole } from '../../common/middlewares/auth.middleware.js';
import { getAll, getById } from './order.controller.js';

const router = Router();

router.use(verifyAuth, requireRole('customer'));

router.get('/', getAll);
router.get('/:id', getById);

export default router;
