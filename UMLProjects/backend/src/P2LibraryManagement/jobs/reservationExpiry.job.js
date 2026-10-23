import cron from 'node-cron';
import * as reservationService from '../services/reservation.service.js';

export const expireOldReservations = async () => {
  try {
    console.log('Running reservation expiry job...');
    await reservationService.expireReservations();
    console.log('Reservation expiry job completed');
  } catch (err) {
    console.error('Error in reservation expiry job:', err);
  }
};

export const startReservationExpiryJob = () => {
  cron.schedule('0 * * * *', expireOldReservations);
  console.log('Reservation expiry job scheduled (runs every hour)');
};