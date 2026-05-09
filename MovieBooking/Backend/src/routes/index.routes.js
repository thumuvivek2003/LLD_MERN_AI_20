import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import movieRoutes from '../modules/movies/movie.routes.js';
import theaterRoutes from '../modules/theaters/theater.routes.js';
import screenRoutes from '../modules/screens/screen.routes.js';
import showRoutes from '../modules/shows/show.routes.js';
import seatRoutes from '../modules/seats/seat.routes.js';
import bookingRoutes from '../modules/bookings/booking.routes.js';
import paymentRoutes from '../modules/payments/payment.routes.js';
import systemRoutes from '../modules/system/system.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/admin', adminRoutes);
router.use('/admin/theaters', theaterRoutes);
router.use('/admin/screens', screenRoutes);
router.use('/shows', showRoutes);
router.use('/seat-locks', seatRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/system', systemRoutes);

export default router;
