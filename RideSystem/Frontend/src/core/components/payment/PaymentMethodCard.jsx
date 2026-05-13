export default function PaymentMethodCard({ method, label, hint, icon, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition flex items-center gap-3 ${
        selected ? 'border-brand bg-brand-light/40 ring-2 ring-brand/40' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <span className="w-10 h-10 rounded-lg bg-slate-100 grid place-items-center text-xl">{icon}</span>
      <div className="flex-1">
        <p className="font-semibold">{label}</p>
        {hint && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
      <span className={`w-5 h-5 rounded-full border-2 ${selected ? 'border-brand bg-brand' : 'border-slate-300'}`} />
    </button>
  );
}
