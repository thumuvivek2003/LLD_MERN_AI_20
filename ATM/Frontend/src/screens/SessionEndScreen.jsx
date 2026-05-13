import { Clock, Home } from 'lucide-react';
import { useATM } from '../context/ATMContext.jsx';

export default function SessionEndScreen() {
  const { backToIdle } = useATM();

  return (
    <div className="flex flex-col items-center text-center gap-6 animate-slide-up">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-atmaccent/15 text-atmaccent">
        <Clock size={32} />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white">Session Ended</h2>
        <p className="mt-2 text-sm text-slate-300">
          You will be logged out of the ATM.
        </p>
        <p className="mt-1 text-sm text-slate-400">Have a nice day!</p>
      </div>
      <button
        type="button"
        onClick={backToIdle}
        className="w-full max-w-xs rounded-xl bg-atmaccent text-slate-900 font-semibold py-2.5 inline-flex items-center justify-center gap-2 hover:bg-cyan-400 active:scale-[0.98] transition-all"
      >
        <Home size={16} /> Back to ATM
      </button>
    </div>
  );
}
