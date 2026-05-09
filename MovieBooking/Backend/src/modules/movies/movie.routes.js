import { Router } from 'express';
import { getMovies, getMovie, createMovie, updateMovie, deleteMovie } from './movie.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requireAdmin } from '../../shared/middleware/admin.middleware.js';

const router = Router();

router.get('/', getMovies);
router.get('/:movieId', getMovie);
router.post('/', authenticate, requireAdmin, createMovie);
router.patch('/:movieId', authenticate, requireAdmin, updateMovie);
router.delete('/:movieId', authenticate, requireAdmin, deleteMovie);

export default router;
