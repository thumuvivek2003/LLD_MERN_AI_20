import SeatToolbar from './SeatToolbar.jsx';
import { useState } from 'react';

const SEAT_COLORS = { normal: '#1a1a2e', premium: '#f59e0b22', maintenance: '#374151' };

export default function SeatDesignerGrid({ layout, onChange }) {
  const [activeTool, setActiveTool] = useState('normal');

  const handleRowClick = (index) => {
    const updated = layout.map((row, i) => i === index ? { ...row, type: activeTool } : row);
    onChange(updated);
  };

  return (
    <div>
      <SeatToolbar activeTool={activeTool} onSelect={setActiveTool} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {layout.map((rowConfig, index) => (
          <div key={rowConfig.row} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 20, textAlign: 'center', color: '#a0a0b0', fontSize: 13 }}>{rowConfig.row}</span>
            <div
              onClick={() => handleRowClick(index)}
              style={{ display: 'flex', gap: 4, padding: 8, borderRadius: 6, cursor: 'pointer', background: SEAT_COLORS[rowConfig.type] || SEAT_COLORS.normal, border: '1px solid #2a2a3e', flex: 1 }}
            >
              {Array.from({ length: rowConfig.seats }, (_, i) => (
                <div key={i} style={{ width: 22, height: 22, borderRadius: 3, background: rowConfig.type === 'premium' ? '#f59e0b' : '#2a2a3e', border: '1px solid #3a3a4e' }} />
              ))}
            </div>
            <span style={{ fontSize: 12, color: '#a0a0b0', textTransform: 'uppercase' }}>{rowConfig.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
