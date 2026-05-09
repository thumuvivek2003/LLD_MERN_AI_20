import { useLocation, useNavigate, Link } from 'react-router-dom';
import { formatCurrency } from '../../shared/utils/formatCurrency.js';
import Button from '../../shared/components/Button.jsx';

export default function BookingSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking;

  if (!booking) { navigate('/'); return null; }

  return (
    <div style={{ maxWidth: 500, margin: '60px auto', padding: '0 16px', textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Booking Confirmed!</h1>
      <p style={{ color: '#a0a0b0', marginBottom: 32 }}>Your tickets are booked. Enjoy the movie!</p>
      <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24, border: '1px solid #2a2a3e', textAlign: 'left', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ color: '#a0a0b0' }}>Booking Ref</span>
          <span style={{ fontWeight: 700, color: '#e50914' }}>{booking.bookingRef}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ color: '#a0a0b0' }}>Seats</span>
          <span>{booking.seats?.map(s => `${s.row}${s.seatNumber}`).join(', ')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#a0a0b0' }}>Total Paid</span>
          <span style={{ fontWeight: 700 }}>{formatCurrency(booking.totalAmount)}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Button variant="secondary" onClick={() => navigate('/my-bookings')}>My Bookings</Button>
        <Button onClick={() => navigate('/')}>Browse Movies</Button>
      </div>
    </div>
  );
}
