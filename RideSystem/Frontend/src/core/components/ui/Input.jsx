export default function Input({ label, error, className = '', ...rest }) {
  return (
    <label className="block">
      {label && <span className="label">{label}</span>}
      <input className={`input ${className}`} {...rest} />
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </label>
  );
}
