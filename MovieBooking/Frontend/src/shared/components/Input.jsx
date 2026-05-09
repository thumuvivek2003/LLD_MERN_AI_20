export default function Input({ label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, color: '#a0a0b0', fontWeight: 500 }}>{label}</label>}
      <input
        style={{ background: '#1a1a2e', border: `1px solid ${error ? '#e50914' : '#2a2a3e'}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, width: '100%' }}
        {...props}
      />
      {error && <span style={{ fontSize: 12, color: '#e50914' }}>{error}</span>}
    </div>
  );
}
