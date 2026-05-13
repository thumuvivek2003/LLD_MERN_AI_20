import { CheckCircle2 } from 'lucide-react';

export default function AuthSuccessScreen() {
  return (
    <div className="flex flex-col items-center text-center gap-6 animate-slide-up">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)]">
        <CheckCircle2 size={48} />
      </div>
      <h2 className="text-xl font-semibold text-emerald-400">Authentication Successful</h2>
      <p className="text-sm text-slate-400">Please wait...</p>
    </div>
  );
}
