const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../../middlewares/auth.middleware');
const {
  createReservation, cancelReservation, getUserReservations, getAllReservations,
} = require('./reservation.controller');

router.post('/', authenticate, createReservation);
router.get('/my', authenticate, getUserReservations);
router.patch('/:id/cancel', authenticate, cancelReservation);
router.get('/', authenticate, authorizeAdmin, getAllReservations);

module.exports = router;
