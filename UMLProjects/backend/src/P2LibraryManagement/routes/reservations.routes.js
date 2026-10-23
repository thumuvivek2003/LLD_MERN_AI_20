import express from 'express';
import * as reservationController from '../controllers/reservation.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/', authenticate, authorize(['member']), reservationController.createReservation);
router.get('/', authenticate, authorize(['admin', 'librarian']), reservationController.getReservations);
router.get('/:id', authenticate, reservationController.getReservation);
router.get('/user/:userId', authenticate, reservationController.getUserReservations);
router.delete('/:id', authenticate, reservationController.cancelReservation);

export default router;