import { Banknote, CheckCircle2 } from 'lucide-react';
import { useATM } from '../context/ATMContext.jsx';

export default function CollectCashScreen() {
  const { finishCollection } = useATM();

  return (
    <div className="flex flex-col items-center text-center gap-6 animate-slide-up">
      <h2 className="text-lg font-semibold text-white">Please collect your cash</h2>

      <div className="relative w-full max-w-xs">
        <div className="mx-auto h-24 w-56 rounded-b-xl border-2 border-t-0 border-atmaccent/40 bg-atmpanel relative overflow-hidden">
          <div className="absolute inset-x-6 top-2 h-3 rounded bg-emerald-500/60 animate-pulse" />
          <div className="absolute inset-x-10 top-7 h-3 rounded bg-emerald-500/40 animate-pulse [animation-delay:0.2s]" />
          <div className="absolute inset-x-14 top-12 h-3 rounded bg-emerald-500/30 animate-pulse [animation-delay:0.4s]" />
          <Banknote className="absolute right-2 bottom-2 text-emerald-400/70" size={22} />
        </div>
        <div className="mx-auto mt-2 h-1.5 w-44 rounded-full bg-atmborder" />
      </div>

      <button
        type="button"
        onClick={finishCollection}
        className="w-full max-w-xs rounded-xl bg-emerald-500 text-slate-900 font-semibold py-3 inline-flex items-center justify-center gap-2 hover:bg-emerald-400 active:scale-[0.98] transition-all"
      >
        <CheckCircle2 size={18} /> Cash Collected
      </button>
    </div>
  );
}
