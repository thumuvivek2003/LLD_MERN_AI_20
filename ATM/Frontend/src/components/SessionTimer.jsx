import { Timer } from 'lucide-react';
import { useATM } from '../context/ATMContext.jsx';

export default function SessionTimer() {
  const { timerActive, secondsLeft } = useATM();

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const danger = secondsLeft <= 10;

  if (!timerActive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-atmborder bg-atmpanel/60 px-3 py-1 text-xs font-medium text-slate-400">
        <Timer size={14} />
        Session: --:--
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tabular-nums transition-colors ${
        danger
          ? 'border-red-500/40 bg-red-500/10 text-red-300'
          : 'border-atmaccent/40 bg-atmaccent/10 text-atmaccent'
      }`}
    >
      <Timer size={14} />
      Session: {mm}:{ss}
    </span>
  );
}
