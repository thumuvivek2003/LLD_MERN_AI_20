import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { successResponse } from '../../shared/utils/apiResponse.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { requireAdmin } from '../../shared/middleware/admin.middleware.js';
import { Movie } from '../movies/movie.model.js';
import { Theater } from '../theaters/theater.model.js';
import { Show } from '../shows/show.model.js';
import { Booking } from '../bookings/booking.model.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', asyncHandler(async (req, res) => {
  const [movies, theaters, shows, bookings] = await Promise.all([
    Movie.countDocuments(),
    Theater.countDocuments(),
    Show.countDocuments(),
    Booking.countDocuments(),
  ]);
  return successResponse(res, { movies, theaters, shows, bookings });
}));

export default router;
