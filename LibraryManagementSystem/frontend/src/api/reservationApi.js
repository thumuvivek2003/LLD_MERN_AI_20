import api from './axiosConfig';

export const reservationApi = {
  createReservation: (bookId) => api.post('/reservations', { bookId }),
  cancelReservation: (id) => api.patch(`/reservations/${id}/cancel`),
  getUserReservations: (params) => api.get('/reservations/my', { params }),
  getAllReservations: (params) => api.get('/reservations', { params }),
};
