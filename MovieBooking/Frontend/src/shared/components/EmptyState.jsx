export default function EmptyState({ title = 'Nothing here', message = '' }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
      <h3 style={{ color: '#fff', marginBottom: 8 }}>{title}</h3>
      {message && <p style={{ color: '#a0a0b0', fontSize: 14 }}>{message}</p>}
    </div>
  );
}
