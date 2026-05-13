import { Banknote } from 'lucide-react';

export default function CashPreparingScreen() {
  return (
    <div className="flex flex-col items-center text-center gap-6 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse-slow" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
          <Banknote size={42} />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-white">Preparing your cash...</h2>
      <div className="flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-atmaccent animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2 w-2 rounded-full bg-atmaccent animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2 w-2 rounded-full bg-atmaccent animate-bounce" />
      </div>
    </div>
  );
}
