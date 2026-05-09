import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SeatDesignerGrid from './components/SeatDesignerGrid.jsx';
import Button from '../../shared/components/Button.jsx';
import Loader from '../../shared/components/Loader.jsx';
import * as adminApi from './admin.api.js';

export default function SeatLayoutDesignerPage() {
  const { screenId } = useParams();
  const [layout, setLayout] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    adminApi.getLayout(screenId).then(res => setLayout(res.data)).finally(() => setLoading(false));
  }, [screenId]);

  const handleSave = async () => {
    await adminApi.updateLayout(screenId, layout);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Seat Layout Designer</h1>
        <Button onClick={handleSave}>{saved ? '✓ Saved!' : 'Save Layout'}</Button>
      </div>
      <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24, border: '1px solid #2a2a3e' }}>
        {layout.length === 0
          ? <p style={{ color: '#a0a0b0', textAlign: 'center' }}>No layout data. Generate from screen settings.</p>
          : <SeatDesignerGrid layout={layout} onChange={setLayout} />
        }
      </div>
    </div>
  );
}
