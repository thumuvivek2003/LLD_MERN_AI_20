export default function PaymentMethodCard({ option, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.type)}
      className={`w-full text-left border-2 rounded-xl p-3 flex items-center gap-3 transition ${
        selected ? 'border-brand bg-brand-light/40' : 'border-slate-200 bg-white hover:border-brand/40'
      }`}
    >
      <span
        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
          selected ? 'border-brand' : 'border-slate-300'
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-brand" />}
      </span>
      <div className="flex-1">
        <p className="font-semibold text-slate-800">{option.label}</p>
        <p className="text-xs text-slate-500">{option.description}</p>
      </div>
    </button>
  );
}
