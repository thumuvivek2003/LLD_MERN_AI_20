import Button from '../../../shared/components/Button.jsx';
import { formatDate } from '../../../shared/utils/formatDate.js';
import StatusBadge from '../../../shared/components/StatusBadge.jsx';

export default function ShowTable({ shows, onEdit, onDelete }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #2a2a3e' }}>
            {['Movie', 'Theater', 'Date', 'Time', 'Price', 'Status', 'Actions'].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#a0a0b0', fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shows.map(show => (
            <tr key={show._id} style={{ borderBottom: '1px solid #2a2a3e' }}>
              <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600 }}>{show.movieId?.title}</td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: '#a0a0b0' }}>{show.theaterId?.name}</td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: '#a0a0b0' }}>{formatDate(show.date)}</td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: '#a0a0b0' }}>{show.startTime}</td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: '#a0a0b0' }}>₹{show.basePrice}</td>
              <td style={{ padding: '12px 16px' }}><StatusBadge status={show.status} /></td>
              <td style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="secondary" onClick={() => onEdit(show)} style={{ padding: '4px 12px', fontSize: 12 }}>Edit</Button>
                  <Button variant="danger" onClick={() => onDelete(show._id)} style={{ padding: '4px 12px', fontSize: 12 }}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
