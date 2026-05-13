import { Wallet, Printer, ArrowLeft } from 'lucide-react';
import { useATM } from '../context/ATMContext.jsx';

export default function CheckBalanceScreen() {
  const { balance, goSelectOperation } = useATM();

  const formatINR = (n) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n || 0);

  return (
    <div className="flex flex-col items-center gap-6 animate-slide-up">
      <h2 className="text-lg font-semibold text-white">Account Balance</h2>

      <div className="w-full max-w-sm rounded-2xl border border-atmaccent/30 bg-atmpanel/80 p-6 text-center shadow-glow">
        <div className="flex justify-center mb-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-atmaccent/15 text-atmaccent">
            <Wallet size={22} />
          </span>
        </div>
        <p className="text-xs uppercase tracking-widest text-slate-400">
          Available Balance
        </p>
        <p className="mt-2 text-3xl sm:text-4xl font-bold text-atmaccent tabular-nums">
          ₹{formatINR(balance)}
        </p>
      </div>

      <div className="flex w-full max-w-sm gap-3">
        <button
          type="button"
          className="flex-1 rounded-xl border border-atmborder bg-atmpanel text-slate-200 font-medium py-2.5 inline-flex items-center justify-center gap-2 hover:border-atmaccent/40 transition-all"
          onClick={() => window.print()}
        >
          <Printer size={16} /> Print Receipt
        </button>
        <button
          type="button"
          onClick={goSelectOperation}
          className="flex-1 rounded-xl bg-atmaccent text-slate-900 font-semibold py-2.5 inline-flex items-center justify-center gap-2 hover:bg-cyan-400 active:scale-[0.98] transition-all"
        >
          <ArrowLeft size={16} /> Back to Menu
        </button>
      </div>
    </div>
  );
}
