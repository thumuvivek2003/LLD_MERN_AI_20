import DenominationTable from '../components/DenominationTable.jsx';
import { useATM } from '../context/ATMContext.jsx';
import { HandCoins } from 'lucide-react';

export default function DispensePreviewScreen() {
  const { breakdown, total, withdrawAmount, collectCash } = useATM();

  const amt = total || Number(withdrawAmount || 0);

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <h2 className="text-lg font-semibold text-white text-center">
        Please collect your cash
      </h2>

      <DenominationTable breakdown={breakdown} total={amt} />

      <p className="text-xs text-slate-500 text-center">
        Press "Collect Cash" to take your money
      </p>

      <button
        type="button"
        onClick={collectCash}
        className="w-full rounded-xl bg-emerald-500 text-slate-900 font-semibold py-3 inline-flex items-center justify-center gap-2 hover:bg-emerald-400 active:scale-[0.99] transition-all"
      >
        <HandCoins size={18} /> Collect Cash
      </button>
    </div>
  );
}
