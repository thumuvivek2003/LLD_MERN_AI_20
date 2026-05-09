import { Router } from 'express';
import { getScreensByTheater, getScreen, createScreen, updateScreen, deleteScreen, getLayout, updateLayout } from './screen.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requireAdmin } from '../../shared/middleware/admin.middleware.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/theater/:theaterId', getScreensByTheater);
router.get('/:screenId', getScreen);
router.post('/', createScreen);
router.patch('/:screenId', updateScreen);
router.delete('/:screenId', deleteScreen);
router.get('/:screenId/layout', getLayout);
router.put('/:screenId/layout', updateLayout);

export default router;
