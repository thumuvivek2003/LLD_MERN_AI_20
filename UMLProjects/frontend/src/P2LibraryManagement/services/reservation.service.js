// services/reservation.service.js
import api from './api.js';

export const createReservation = async (reservationData) => {
  const response = await api.post('/reservations', reservationData);
  return response.data;
};

export const getReservations = async (params = {}) => {
  const response = await api.get('/reservations', { params });
  return response.data;
};

export const getReservation = async (id) => {
  const response = await api.get(`/reservations/${id}`);
  return response.data;
};

export const getUserReservations = async (userId) => {
  const response = await api.get(`/reservations/user/${userId}`);
  return response.data;
};

export const cancelReservation = async (id) => {
  const response = await api.delete(`/reservations/${id}`);
  return response.data;
};