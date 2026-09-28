import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import cx from '../../utils/cx.js';

const STYLES = {
  success: { icon: CheckCircle2, ring: 'ring-emerald-100', tint: 'text-emerald-500' },
  error: { icon: XCircle, ring: 'ring-rose-100', tint: 'text-rose-500' },
  warning: { icon: AlertTriangle, ring: 'ring-amber-100', tint: 'text-amber-500' },
  info: { icon: Info, ring: 'ring-sky-100', tint: 'text-sky-500' },
};

/** Presentational toast — the stack + lifecycle live in ToastContext. */
export function Toast({ tone = 'info', title, message, onDismiss }) {
  const style = STYLES[tone] || STYLES.info;
  const Icon = style.icon;
  return (
    <div
      role="status"
      className={cx(
        'pointer-events-auto flex w-80 items-start gap-3 rounded-xl bg-white p-3.5 shadow-pop ring-1 animate-slide-up',
        style.ring,
      )}
    >
      <Icon size={18} className={cx('mt-0.5 shrink-0', style.tint)} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {message && <p className="mt-0.5 break-words text-xs leading-relaxed text-slate-500">{message}</p>}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="rounded p-0.5 text-slate-300 transition hover:bg-slate-100 hover:text-slate-500"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default Toast;
