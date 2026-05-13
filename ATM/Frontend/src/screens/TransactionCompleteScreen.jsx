import { CheckCircle2, Printer, ArrowLeft } from 'lucide-react';
import { useATM } from '../context/ATMContext.jsx';

export default function TransactionCompleteScreen() {
  const { transactionId, total, withdrawAmount, goSelectOperation } = useATM();
  const amt = total || Number(withdrawAmount || 0);
  const formatINR = (n) => new Intl.NumberFormat('en-IN').format(n || 0);

  return (
    <div className="flex flex-col items-center text-center gap-6 animate-slide-up">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)]">
        <CheckCircle2 size={48} />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-emerald-400">
          Transaction Successful
        </h2>
        <p className="mt-2 text-sm text-slate-300">Thank you</p>
      </div>

      <div className="w-full max-w-sm rounded-xl border border-atmborder bg-atmpanel p-4 text-left text-sm">
        <div className="flex justify-between py-1">
          <span className="text-slate-400">Amount</span>
          <span className="font-semibold text-white">₹{formatINR(amt)}</span>
        </div>
        {transactionId && (
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Txn ID</span>
            <span className="font-mono text-xs text-slate-300">{transactionId}</span>
          </div>
        )}
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
