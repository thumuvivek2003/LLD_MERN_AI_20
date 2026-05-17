import { Loader2 } from 'lucide-react';

export default function Loader({ label = 'Loading…', full = false }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 text-sm text-slate-500 ${
        full ? 'py-20' : 'py-6'
      }`}
    >
      <Loader2 size={16} className="animate-spin text-brand-600" />
      <span>{label}</span>
    </div>
  );
}
