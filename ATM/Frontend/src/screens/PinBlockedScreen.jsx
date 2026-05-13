import { Lock } from 'lucide-react';
import { useATM } from '../context/ATMContext.jsx';

export default function PinBlockedScreen() {
  const { backToIdle } = useATM();

  return (
    <div className="flex flex-col items-center text-center gap-6 animate-slide-up">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 text-red-400">
        <Lock size={32} />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-red-400">Card is Blocked</h2>
        <p className="mt-2 text-sm text-slate-300">
          Please contact your bank for assistance.
        </p>
      </div>
      <button
        type="button"
        onClick={backToIdle}
        className="w-full max-w-xs rounded-xl bg-atmpanel border border-atmborder text-white font-semibold py-2.5 transition-all hover:border-atmaccent/40"
      >
        Back to Idle
      </button>
    </div>
  );
}
