import Button from './Button.jsx';

export default function Pagination({ page, total, limit, onChange }) {
  const pages = Math.ceil(total / limit);
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
      <Button variant="secondary" onClick={() => onChange(page - 1)} disabled={page <= 1}>Prev</Button>
      <span style={{ color: '#a0a0b0', fontSize: 14 }}>{page} / {pages}</span>
      <Button variant="secondary" onClick={() => onChange(page + 1)} disabled={page >= pages}>Next</Button>
    </div>
  );
}
