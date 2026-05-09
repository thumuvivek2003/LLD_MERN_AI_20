import Button from '../../../shared/components/Button.jsx';

export default function TheaterTable({ theaters, onEdit, onDelete }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #2a2a3e' }}>
            {['Name', 'City', 'Address', 'Screens', 'Actions'].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#a0a0b0', fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {theaters.map(theater => (
            <tr key={theater._id} style={{ borderBottom: '1px solid #2a2a3e' }}>
              <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600 }}>{theater.name}</td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: '#a0a0b0' }}>{theater.city}</td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: '#a0a0b0' }}>{theater.address}</td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: '#a0a0b0' }}>{theater.totalScreens}</td>
              <td style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="secondary" onClick={() => onEdit(theater)} style={{ padding: '4px 12px', fontSize: 12 }}>Edit</Button>
                  <Button variant="danger" onClick={() => onDelete(theater._id)} style={{ padding: '4px 12px', fontSize: 12 }}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
