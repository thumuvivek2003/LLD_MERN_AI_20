import { useNavigate } from 'react-router-dom';

export default function ShowTimeCard({ show }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/shows/${show._id}/seats`)}
      style={{ background: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: 8, padding: '8px 16px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#e50914'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a3e'}
    >
      <div style={{ fontWeight: 700, fontSize: 15 }}>{show.startTime}</div>
      <div style={{ fontSize: 12, color: '#a0a0b0' }}>₹{show.basePrice}</div>
    </button>
  );
}
