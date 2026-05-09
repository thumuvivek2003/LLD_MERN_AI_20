import Button from '../../../shared/components/Button.jsx';

export default function MovieTable({ movies, onEdit, onDelete }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #2a2a3e' }}>
            {['Title', 'Genre', 'Duration', 'Language', 'Rating', 'Actions'].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#a0a0b0', fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie._id} style={{ borderBottom: '1px solid #2a2a3e' }}>
              <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600 }}>{movie.title}</td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: '#a0a0b0' }}>{movie.genre?.join(', ')}</td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: '#a0a0b0' }}>{movie.duration} min</td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: '#a0a0b0' }}>{movie.language}</td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: '#f59e0b' }}>★ {movie.rating}</td>
              <td style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="secondary" onClick={() => onEdit(movie)} style={{ padding: '4px 12px', fontSize: 12 }}>Edit</Button>
                  <Button variant="danger" onClick={() => onDelete(movie._id)} style={{ padding: '4px 12px', fontSize: 12 }}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
