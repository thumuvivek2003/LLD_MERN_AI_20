import { formatDate } from '../../../shared/utils/formatDate.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import StatusBadge from '../../../shared/components/StatusBadge.jsx';

export default function TicketCard({ booking }) {
  const show = booking.showId;
  const movie = show?.movieId;

  return (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 20, border: '1px solid #2a2a3e', display: 'flex', gap: 16 }}>
      <div style={{ width: 60, height: 90, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        {movie?.posterUrl ? <img src={movie.posterUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🎬'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>{movie?.title || 'Movie'}</h3>
          <StatusBadge status={booking.status} />
        </div>
        <p style={{ fontSize: 13, color: '#a0a0b0', marginBottom: 4 }}>{show?.theaterId?.name} • {show?.startTime}</p>
        <p style={{ fontSize: 13, color: '#a0a0b0', marginBottom: 8 }}>{show?.date && formatDate(show.date)}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: '#a0a0b0' }}>Seats: {booking.seats?.map(s => `${s.row}${s.seatNumber}`).join(', ')}</span>
          <span style={{ fontWeight: 700, color: '#e50914' }}>{formatCurrency(booking.totalAmount)}</span>
        </div>
        <p style={{ fontSize: 11, color: '#a0a0b0', marginTop: 4 }}>Ref: {booking.bookingRef}</p>
      </div>
    </div>
  );
}
