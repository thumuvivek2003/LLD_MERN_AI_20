import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as bookingApi from './booking.api.js';
import { useBookingStore } from './booking.store.js';

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const { selectedShow, selectedSeats, paymentId, reset } = useBookingStore();
  const navigate = useNavigate();

  const confirmBooking = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.createBooking({
        showId: selectedShow?._id,
        seatIds: selectedSeats.map(s => s._id),
        paymentId,
      });
      reset();
      navigate('/booking-success', { state: { booking: res.data } });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getUserBookings();
      setBookings(res.data);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    await bookingApi.cancelBooking(id);
    loadBookings();
  };

  return { loading, bookings, confirmBooking, loadBookings, cancelBooking, selectedShow, selectedSeats };
};
