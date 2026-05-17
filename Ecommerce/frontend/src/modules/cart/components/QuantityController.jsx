export default function QuantityController({ value, onChange, min = 1, max = 99, disabled = false }) {
  return (
    <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden">
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
        className="px-3 py-1 text-lg hover:bg-slate-50 disabled:opacity-40"
      >
        −
      </button>
      <span className="px-3 py-1 min-w-[2.5rem] text-center font-semibold">{value}</span>
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        className="px-3 py-1 text-lg hover:bg-slate-50 disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}
