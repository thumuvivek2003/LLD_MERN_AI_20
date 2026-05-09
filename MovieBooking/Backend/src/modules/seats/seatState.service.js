import * as repo from './seat.repository.js';
import { Show } from '../shows/show.model.js';
import { Screen } from '../screens/screen.model.js';

export const initializeSeatsForShow = async (showId) => {
  const show = await Show.findById(showId).populate('screenId');
  if (!show) throw Object.assign(new Error('Show not found'), { statusCode: 404 });

  const screen = show.screenId;
  const seats = [];

  for (const rowConfig of screen.seatLayout) {
    for (let i = 1; i <= rowConfig.seats; i++) {
      seats.push({
        showId,
        screenId: screen._id,
        row: rowConfig.row,
        seatNumber: i,
        type: rowConfig.type,
        price: rowConfig.type === 'premium' ? (show.premiumPrice || show.basePrice * 1.5) : show.basePrice,
        status: 'available',
      });
    }
  }

  await repo.createMany(seats);
  return seats.length;
};

export const getSeatsForShow = (showId) => repo.findByShow(showId);
