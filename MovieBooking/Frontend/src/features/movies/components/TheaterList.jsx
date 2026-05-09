import ShowTimeCard from './ShowTimeCard.jsx';
import { formatDate } from '../../../shared/utils/formatDate.js';

export default function TheaterList({ shows }) {
  const grouped = shows.reduce((acc, show) => {
    const key = show.theaterId?._id || show.theaterId;
    if (!acc[key]) acc[key] = { theater: show.theaterId, shows: [] };
    acc[key].shows.push(show);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {Object.values(grouped).map(({ theater, shows: theaterShows }) => (
        <div key={theater?._id} style={{ background: '#1a1a2e', borderRadius: 12, padding: 20, border: '1px solid #2a2a3e' }}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>{theater?.name}</h3>
            <p style={{ color: '#a0a0b0', fontSize: 13 }}>{theater?.city}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {theaterShows.map(show => <ShowTimeCard key={show._id} show={show} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
