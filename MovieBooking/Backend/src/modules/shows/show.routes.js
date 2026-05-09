import { Router } from 'express';
import { getShows, getShow, getShowsByMovie, createShow, updateShow, deleteShow } from './show.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requireAdmin } from '../../shared/middleware/admin.middleware.js';

const router = Router();

router.get('/', getShows);
router.get('/:showId', getShow);
router.get('/movie/:movieId', getShowsByMovie);
router.post('/', authenticate, requireAdmin, createShow);
router.patch('/:showId', authenticate, requireAdmin, updateShow);
router.delete('/:showId', authenticate, requireAdmin, deleteShow);

export default router;
