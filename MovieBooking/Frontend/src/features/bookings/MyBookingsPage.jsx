import { useEffect } from 'react';
import TicketCard from './components/TicketCard.jsx';
import Loader from '../../shared/components/Loader.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import Button from '../../shared/components/Button.jsx';
import { useBooking } from './useBooking.js';

export default function MyBookingsPage() {
  const { bookings, loading, loadBookings, cancelBooking } = useBooking();

  useEffect(() => { loadBookings(); }, []);

  if (loading) return <Loader />;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 0' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>My Bookings</h1>
      {bookings.length === 0 ? (
        <EmptyState title="No bookings yet" message="Book a movie to see your tickets here" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {bookings.map(booking => (
            <div key={booking._id}>
              <TicketCard booking={booking} />
              {booking.status === 'confirmed' && (
                <div style={{ marginTop: 8, textAlign: 'right' }}>
                  <Button variant="ghost" onClick={() => cancelBooking(booking._id)} style={{ fontSize: 13, padding: '6px 14px' }}>Cancel</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
