import { Router } from 'express';
import { getTheaters, getTheater, createTheater, updateTheater, deleteTheater } from './theater.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requireAdmin } from '../../shared/middleware/admin.middleware.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/', getTheaters);
router.get('/:theaterId', getTheater);
router.post('/', createTheater);
router.patch('/:theaterId', updateTheater);
router.delete('/:theaterId', deleteTheater);

export default router;
