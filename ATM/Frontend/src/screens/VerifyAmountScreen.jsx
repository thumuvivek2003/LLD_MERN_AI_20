import { useATM } from '../context/ATMContext.jsx';

export default function VerifyAmountScreen() {
  const { withdrawAmount, total, confirmWithdraw, startWithdraw } = useATM();

  const formatINR = (n) => new Intl.NumberFormat('en-IN').format(n || 0);
  const amt = total || Number(withdrawAmount || 0);

  return (
    <div className="flex flex-col items-center gap-5 animate-slide-up">
      <h2 className="text-lg font-semibold text-white">
        Please confirm withdrawal amount
      </h2>

      <div className="w-full max-w-sm rounded-2xl border border-atmaccent/30 bg-atmpanel p-6 text-center shadow-glow">
        <p className="text-xs uppercase tracking-widest text-slate-400">Amount</p>
        <p className="mt-2 text-3xl font-bold text-atmaccent tabular-nums">
          ₹{formatINR(amt)}
        </p>
        <div className="mt-3 text-xs text-slate-500">
          Total Debit: ₹{formatINR(amt)}
        </div>
      </div>

      <div className="flex w-full max-w-sm gap-3">
        <button
          type="button"
          onClick={startWithdraw}
          className="flex-1 rounded-xl border border-atmborder bg-atmpanel text-slate-200 font-medium py-2.5 hover:border-atmaccent/40 transition-all"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={confirmWithdraw}
          className="flex-1 rounded-xl bg-emerald-500 text-slate-900 font-semibold py-2.5 hover:bg-emerald-400 active:scale-[0.98] transition-all"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
