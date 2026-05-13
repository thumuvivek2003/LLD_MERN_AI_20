import { XCircle } from 'lucide-react';
import { useATM } from '../context/ATMContext.jsx';

export default function WrongPinScreen() {
  const { attemptsLeft, setAtmState } = useATM();

  return (
    <div className="flex flex-col items-center text-center gap-6 animate-slide-up">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 text-red-400">
        <XCircle size={36} />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-red-400">Incorrect PIN</h2>
        <p className="mt-2 text-sm text-slate-300">Please try again.</p>
      </div>
      <p className="text-sm text-slate-200">
        Attempts left:{' '}
        <span className="font-bold text-red-400">{attemptsLeft}</span>
        <span className="text-slate-500"> / 3</span>
      </p>
      <button
        type="button"
        onClick={() => setAtmState('ENTER_PIN')}
        className="w-full max-w-xs rounded-xl bg-atmaccent text-slate-900 font-semibold py-2.5 transition-all hover:bg-cyan-400 active:scale-[0.98]"
      >
        Try Again
      </button>
    </div>
  );
}
