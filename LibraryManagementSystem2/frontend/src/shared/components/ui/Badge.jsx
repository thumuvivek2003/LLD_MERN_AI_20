export default function Badge({ label, variant = 'default' }) {
  return <span className={`badge badge-${variant.toLowerCase()}`}>{label}</span>;
}
