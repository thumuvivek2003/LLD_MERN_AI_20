const PROVIDERS = ['Paytm', 'PhonePe', 'Amazon Pay'];

export default function WalletPaymentForm({ value = {}, onChange }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 mt-3 bg-slate-50/40">
      <p className="text-sm font-semibold text-slate-700 mb-3">Choose Wallet</p>
      <div className="grid grid-cols-3 gap-2">
        {PROVIDERS.map((p) => {
          const active = value.provider === p;
          return (
            <button
              type="button"
              key={p}
              onClick={() => onChange({ ...value, provider: p })}
              className={`px-3 py-2 rounded-xl text-sm font-semibold border-2 transition ${
                active ? 'border-brand bg-brand text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-brand/40'
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>
    </div>
  );
}
