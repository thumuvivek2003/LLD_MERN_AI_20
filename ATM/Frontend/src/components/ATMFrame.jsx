import { ShieldCheck, AlertTriangle } from 'lucide-react';
import SessionTimer from './SessionTimer.jsx';
import { useATM } from '../context/ATMContext.jsx';

export default function ATMFrame({ children }) {
  const { handleActivity } = useATM();

  return (
    <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8">
      <div
        className="w-full max-w-[640px] rounded-3xl border border-atmborder bg-atmcard/70 backdrop-blur-md shadow-kiosk overflow-hidden"
        onClick={handleActivity}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-atmborder px-5 py-3 bg-atmpanel/80">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-atmaccent/15 text-atmaccent">
              <ShieldCheck size={18} />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-wider text-white">ATM</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Secure
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SessionTimer />
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
              <AlertTriangle size={12} />
              Max 3 Attempts
            </span>
          </div>
        </div>

        {/* Screen body */}
        <div className="kiosk-screen relative min-h-[460px] sm:min-h-[520px] px-5 py-6 sm:px-8 sm:py-8">
          <div className="animate-fade-in">{children}</div>
        </div>

        {/* Footer slot (subtle hardware look) */}
        <div className="flex items-center justify-center gap-1.5 border-t border-atmborder bg-atmpanel/60 py-3">
          <span className="h-1.5 w-10 rounded-full bg-atmborder" />
          <span className="h-1.5 w-2 rounded-full bg-atmborder" />
          <span className="h-1.5 w-10 rounded-full bg-atmborder" />
        </div>
      </div>
    </div>
  );
}
