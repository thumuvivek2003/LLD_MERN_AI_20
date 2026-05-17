export default function Input({ label, error, className = '', ...rest }) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <input className={`input ${error ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : ''} ${className}`} {...rest} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
