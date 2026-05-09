export default function DashboardStats({ stats }) {
  const cards = [
    { label: 'Total Movies', value: stats?.movies || 0, icon: '🎬' },
    { label: 'Total Theaters', value: stats?.theaters || 0, icon: '🏛️' },
    { label: 'Total Shows', value: stats?.shows || 0, icon: '🎭' },
    { label: 'Total Bookings', value: stats?.bookings || 0, icon: '🎟️' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
      {cards.map(({ label, value, icon }) => (
        <div key={label} style={{ background: '#1a1a2e', borderRadius: 12, padding: 20, border: '1px solid #2a2a3e' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{value}</div>
          <div style={{ fontSize: 13, color: '#a0a0b0' }}>{label}</div>
        </div>
      ))}
    </div>
  );
}
