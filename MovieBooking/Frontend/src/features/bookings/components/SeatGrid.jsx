import { groupSeatsByRow } from '../../../shared/utils/seatHelpers.js';
import SeatItem from './SeatItem.jsx';

export default function SeatGrid({ seats, selected, onToggle }) {
  const rows = groupSeatsByRow(seats);

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24, padding: '8px 40px', background: '#e5091420', borderRadius: 8, color: '#e50914', fontSize: 13, letterSpacing: 2 }}>
        SCREEN
      </div>
      {Object.entries(rows).sort(([a], [b]) => a.localeCompare(b)).map(([row, rowSeats]) => (
        <div key={row} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ width: 20, color: '#a0a0b0', fontSize: 13, textAlign: 'center' }}>{row}</span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {rowSeats.sort((a, b) => a.seatNumber - b.seatNumber).map(seat => (
              <SeatItem
                key={seat._id}
                seat={seat}
                isSelected={!!selected.find(s => s._id === seat._id)}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 16, marginTop: 24, justifyContent: 'center', fontSize: 12, color: '#a0a0b0' }}>
        {[['#1a1a2e', 'Available'], ['#e50914', 'Selected'], ['#f59e0b', 'Locked'], ['#374151', 'Booked']].map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 14, height: 14, background: color, borderRadius: 3, border: '1px solid #2a2a3e' }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
