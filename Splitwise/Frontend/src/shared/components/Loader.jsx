import { Loader2 } from 'lucide-react';

export default function Loader({ label = 'Loading...', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-10 text-slate-500 ${className}`}>
      <Loader2 className="w-7 h-7 animate-spin text-brand-500 mb-2" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
