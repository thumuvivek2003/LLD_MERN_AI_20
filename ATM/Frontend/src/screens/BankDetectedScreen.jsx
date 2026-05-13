import { Landmark, Loader2 } from 'lucide-react';
import { useATM } from '../context/ATMContext.jsx';

export default function BankDetectedScreen() {
  const { bankInfo } = useATM();

  return (
    <div className="flex flex-col items-center text-center gap-6 animate-slide-up">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-atmaccent/15 text-atmaccent">
        <Landmark size={32} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">Your Bank</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">
          {bankInfo?.bankName || 'Detecting...'}
        </h2>
      </div>

      <div className="inline-flex items-center gap-2 text-sm text-slate-300">
        <Loader2 className="animate-spin text-atmaccent" size={18} />
        Connecting securely...
      </div>
    </div>
  );
}
