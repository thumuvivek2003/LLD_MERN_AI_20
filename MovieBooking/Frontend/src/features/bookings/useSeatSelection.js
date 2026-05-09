import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as bookingApi from './booking.api.js';
import { useBookingStore } from './booking.store.js';

export const useSeatSelection = (showId) => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const setSelectedSeats = useBookingStore(s => s.setSelectedSeats);
  const setSelectedShow = useBookingStore(s => s.setSelectedShow);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showId) return;
    setLoading(true);
    bookingApi.getSeatLayout(showId)
      .then(res => setSeats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [showId]);

  const toggleSeat = (seat) => {
    if (seat.status !== 'available') return;
    setSelected(prev =>
      prev.find(s => s._id === seat._id)
        ? prev.filter(s => s._id !== seat._id)
        : [...prev, seat]
    );
  };

  const proceed = async (show) => {
    if (selected.length === 0) return;
    const seatIds = selected.map(s => s._id);
    await bookingApi.lockSeats({ showId, seatIds });
    setSelectedSeats(selected);
    setSelectedShow(show);
    navigate('/payment');
  };

  return { seats, loading, selected, toggleSeat, proceed };
};
