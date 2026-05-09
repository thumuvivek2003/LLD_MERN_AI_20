import { getSeatColor } from '../../../shared/utils/seatHelpers.js';

export default function SeatItem({ seat, isSelected, onToggle }) {
  const clickable = seat.status === 'available';
  return (
    <div
      onClick={() => clickable && onToggle(seat)}
      title={`${seat.row}${seat.seatNumber} - ₹${seat.price}`}
      style={{
        width: 28, height: 28, borderRadius: 4,
        background: getSeatColor(seat.status, isSelected),
        border: `1px solid ${isSelected ? '#e50914' : seat.type === 'premium' ? '#f59e0b33' : '#2a2a3e'}`,
        cursor: clickable ? 'pointer' : 'not-allowed',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, color: '#fff', transition: 'transform 0.1s',
      }}
      onMouseEnter={e => clickable && (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {seat.seatNumber}
    </div>
  );
}
