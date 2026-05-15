import { useEffect } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const STYLES = {
  success: 'bg-emerald-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-slate-800 text-white'
};

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info
};

export default function Toast() {
  const { toast, dismissToast } = useApp();

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => dismissToast(), 3500);
    return () => clearTimeout(t);
  }, [toast, dismissToast]);

  if (!toast) return null;
  const Icon = ICONS[toast.type] || Info;

  return (
    <div className="fixed bottom-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-card animate-slide-up max-w-sm w-full sm:w-auto ${STYLES[toast.type] || STYLES.info}`}
      >
        <Icon className="w-5 h-5 shrink-0" />
        <span className="text-sm font-medium flex-1">{toast.message}</span>
        <button
          onClick={dismissToast}
          className="p-1 rounded-md hover:bg-white/10"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
