const colors = {
  confirmed: '#22c55e', pending: '#f59e0b', cancelled: '#ef4444',
  active: '#22c55e', available: '#22c55e', booked: '#6b7280', locked: '#f59e0b',
};

export default function StatusBadge({ status }) {
  return (
    <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: `${colors[status] || '#6b7280'}22`, color: colors[status] || '#6b7280' }}>
      {status}
    </span>
  );
}
