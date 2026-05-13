import { Router } from 'express';
import { authMiddleware } from '../../core/middleware/auth.middleware.js';
import { requireRole } from '../../core/middleware/role.middleware.js';
import { validate } from '../../core/middleware/validate.middleware.js';
import { ROLES } from '../../config/constants.js';
import { rideController } from './ride.controller.js';
import { validateCreateRide, validateOtp } from './ride.validation.js';

const router = Router();
router.use(authMiddleware);

// Rider
router.post('/', requireRole(ROLES.RIDER), validate(validateCreateRide), rideController.create);
router.get('/me/active', requireRole(ROLES.RIDER), rideController.myActive);
router.get('/me/unpaid', requireRole(ROLES.RIDER), rideController.myUnpaid);
router.get('/me/history', requireRole(ROLES.RIDER), rideController.myHistory);

// Driver
router.get('/pending', requireRole(ROLES.DRIVER), rideController.pending);
router.get('/driver/history', requireRole(ROLES.DRIVER), rideController.driverHistory);
router.post('/:id/accept', requireRole(ROLES.DRIVER), rideController.accept);
router.post('/:id/arrive', requireRole(ROLES.DRIVER), rideController.arrive);
router.post('/:id/verify-otp', requireRole(ROLES.DRIVER), validate(validateOtp), rideController.verifyOtp);
router.post('/:id/complete', requireRole(ROLES.DRIVER), rideController.complete);

// Shared
router.post('/:id/cancel', rideController.cancel);
router.get('/:id', rideController.getById);

export default router;
