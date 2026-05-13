import { Router } from 'express';
import { authMiddleware } from '../../core/middleware/auth.middleware.js';
import { requireRole } from '../../core/middleware/role.middleware.js';
import { ROLES } from '../../config/constants.js';
import { paymentController } from './payment.controller.js';

const router = Router();
router.use(authMiddleware);

router.post('/:rideId', requireRole(ROLES.RIDER), paymentController.pay);
router.post('/:rideId/receive-cash', requireRole(ROLES.DRIVER), paymentController.receiveCash);
router.get('/ride/:rideId', paymentController.forRide);
router.get('/driver/earnings', requireRole(ROLES.DRIVER), paymentController.driverEarnings);

export default router;
