import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movies/${movie._id || movie.id}`)}
      style={{ background: '#1a1a2e', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', border: '1px solid #2a2a3e', transition: 'transform 0.2s', width: 180 }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{ width: '100%', height: 260, background: '#0f0f1a', overflow: 'hidden' }}>
        {movie.posterUrl
          ? <img src={movie.posterUrl} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🎬</div>
        }
      </div>
      <div style={{ padding: '12px 14px' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.title}</h3>
        <p style={{ fontSize: 12, color: '#a0a0b0' }}>{movie.genre?.join(', ')}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 12, color: '#a0a0b0' }}>{movie.duration} min</span>
          {movie.rating > 0 && <span style={{ fontSize: 12, color: '#f59e0b' }}>★ {movie.rating}</span>}
        </div>
      </div>
    </div>
  );
}
