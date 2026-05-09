import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

export default function BookingSummary({ show, seats }) {
  const total = seats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 20, border: '1px solid #2a2a3e' }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Booking Summary</h3>
      {show && (
        <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #2a2a3e' }}>
          <p style={{ fontWeight: 600 }}>{show.movieId?.title || show.title}</p>
          <p style={{ fontSize: 13, color: '#a0a0b0' }}>{show.startTime} • {show.theaterId?.name}</p>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {seats.map(seat => (
          <div key={seat._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: '#a0a0b0' }}>{seat.row}{seat.seatNumber} ({seat.type})</span>
            <span>{formatCurrency(seat.price)}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, paddingTop: 12, borderTop: '1px solid #2a2a3e' }}>
        <span>Total</span>
        <span style={{ color: '#e50914' }}>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
