// pages/member/CancelReservation.jsx
import { useState, useEffect } from 'react';
import { getUserReservations, cancelReservation } from '../../services/reservation.service';
import ReservationCard from '../../components/ReservationCard';
import Loader from '../../components/Loader';

function CancelReservation() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await getUserReservations();
      setReservations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservation) => {
    try {
      await cancelReservation(reservation._id);
      setMessage('Reservation cancelled successfully');
      fetchReservations();
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Cancel Reservation</h1>
      {message && (
        <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4">{message}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation._id}
            reservation={reservation}
            onCancel={handleCancel}
          />
        ))}
      </div>
    </div>
  );
}

export default CancelReservation;