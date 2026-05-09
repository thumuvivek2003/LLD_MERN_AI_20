import { Router } from 'express';
import { getUserBookings, getBooking, createBooking, cancelBooking } from './booking.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/me', getUserBookings);
router.get('/:bookingId', getBooking);
router.post('/', createBooking);
router.patch('/:bookingId/cancel', cancelBooking);

export default router;
