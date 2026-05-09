import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SeatGrid from './components/SeatGrid.jsx';
import BookingSummary from './components/BookingSummary.jsx';
import Button from '../../shared/components/Button.jsx';
import Loader from '../../shared/components/Loader.jsx';
import { useSeatSelection } from './useSeatSelection.js';
import api from '../../shared/api/axios.js';
import { ENDPOINTS } from '../../shared/api/apiEndpoints.js';

export default function SeatSelectionPage() {
  const { showId } = useParams();
  const { seats, loading, selected, toggleSeat, proceed } = useSeatSelection(showId);
  const [show, setShow] = useState(null);

  useEffect(() => {
    api.get(ENDPOINTS.shows.detail(showId)).then(res => setShow(res.data));
  }, [showId]);

  if (loading) return <Loader />;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 0' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Select Seats</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24, border: '1px solid #2a2a3e' }}>
          <SeatGrid seats={seats} selected={selected} onToggle={toggleSeat} />
        </div>
        <div>
          <BookingSummary show={show} seats={selected} />
          <Button fullWidth onClick={() => proceed(show)} disabled={selected.length === 0} style={{ marginTop: 16 }}>
            Proceed to Payment ({selected.length} seats)
          </Button>
        </div>
      </div>
    </div>
  );
}
