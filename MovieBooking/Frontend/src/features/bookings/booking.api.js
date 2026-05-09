import api from '../../shared/api/axios.js';
import { ENDPOINTS } from '../../shared/api/apiEndpoints.js';

export const getSeatLayout = (showId) => api.get(ENDPOINTS.shows.seats(showId));
export const lockSeats = (data) => api.post(ENDPOINTS.seatLocks.lock, data);
export const createBooking = (data) => api.post(ENDPOINTS.bookings.create, data);
export const getUserBookings = () => api.get(ENDPOINTS.bookings.list);
export const getBooking = (id) => api.get(ENDPOINTS.bookings.detail(id));
export const cancelBooking = (id) => api.patch(ENDPOINTS.bookings.cancel(id));
