import * as reservationService from '../services/reservation.service.js';
import { success, error } from '../utils/responses.js';

export const createReservation = async (req, res) => {
  try {
    const reservation = await reservationService.createReservation(req.body);
    success(res, reservation, 'Reservation created successfully', 201);
  } catch (err) {
    error(res, err.message, 400);
  }
};

export const getReservations = async (req, res) => {
  try {
    const reservations = await reservationService.getReservationsByUser(req.user.id);
    success(res, reservations, 'Reservations fetched successfully');
  } catch (err) {
    error(res, err.message, 400);
  }
};

export const getReservation = async (req, res) => {
  try {
    const reservation = await reservationService.getReservationById(req.params.id);
    success(res, reservation, 'Reservation fetched successfully');
  } catch (err) {
    error(res, err.message, 404);
  }
};

export const getUserReservations = async (req, res) => {
  try {
    const reservations = await reservationService.getReservationsByUser(req.params.userId);
    success(res, reservations, 'User reservations fetched successfully');
  } catch (err) {
    error(res, err.message, 400);
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const reservation = await reservationService.cancelReservation(req.params.id, req.user.id);
    success(res, reservation, 'Reservation cancelled successfully');
  } catch (err) {
    error(res, err.message, 400);
  }
};