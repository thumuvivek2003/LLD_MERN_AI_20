export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <span style={{ position: 'absolute', left: 12, color: '#a0a0b0' }}>🔍</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ paddingLeft: 36, paddingRight: 16, paddingTop: 10, paddingBottom: 10, background: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: 8, color: '#fff', fontSize: 14, width: 280 }}
      />
    </div>
  );
}
