import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/user/user.routes.js';
import driverRoutes from '../modules/driver/driver.routes.js';
import vehicleRoutes from '../modules/vehicle/vehicle.routes.js';
import rideRoutes from '../modules/ride/ride.routes.js';
import paymentRoutes from '../modules/payment/payment.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/drivers', driverRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/rides', rideRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
