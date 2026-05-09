import Button from '../../../shared/components/Button.jsx';

export default function SeatToolbar({ activeTool, onSelect }) {
  const tools = [
    { id: 'normal', label: 'Normal', color: '#1a1a2e' },
    { id: 'premium', label: 'Premium', color: '#f59e0b33' },
    { id: 'maintenance', label: 'Block', color: '#374151' },
  ];

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
      {tools.map(tool => (
        <button key={tool.id} onClick={() => onSelect(tool.id)}
          style={{ padding: '8px 16px', borderRadius: 8, border: `2px solid ${activeTool === tool.id ? '#e50914' : '#2a2a3e'}`, background: tool.color, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          {tool.label}
        </button>
      ))}
    </div>
  );
}
