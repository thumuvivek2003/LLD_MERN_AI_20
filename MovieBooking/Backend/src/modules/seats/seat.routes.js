import { Router } from 'express';
import { getSeatLayout, lockSeats } from './seat.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.get('/show/:showId', getSeatLayout);
router.post('/', authenticate, lockSeats);

export default router;
