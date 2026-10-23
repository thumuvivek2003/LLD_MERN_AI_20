import Reservation from '../models/reservation.model.js';

export const createReservation = async (data) => {
  const reservation = new Reservation(data);
  return await reservation.save();
};

export const findReservationById = async (id) => {
  return await Reservation.findById(id).populate('book user');
};

export const findActiveReservationForBook = async (bookId) => {
  return await Reservation.findOne({
    book: bookId,
    status: 'active'
  }).populate('book user');
};

export const deleteReservation = async (id) => {
  return await Reservation.findByIdAndDelete(id);
};

export const getReservationsByUser = async (userId) => {
  return await Reservation.find({ user: userId })
    .populate('book user')
    .sort({ createdAt: -1 });
};