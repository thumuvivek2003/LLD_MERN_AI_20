import Avatar from './Avatar.jsx';
import { CloseIcon, BellIcon, CheckIcon } from './Icons.jsx';

function ToastCard({ toast, onDismiss }) {
  const { variant } = toast;

  if (variant === 'mail') {
    return (
      <div className="pointer-events-auto w-80 animate-toast-in overflow-hidden rounded-2xl bg-white shadow-pop ring-1 ring-slate-200/70">
        <div className="flex items-start gap-3 p-4">
          <Avatar
            name={toast.senderName}
            color={toast.avatarColor}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">
                {toast.title || 'New Email'}
              </p>
              <span className="text-[11px] font-medium text-slate-400">
                Now
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500">
              From: {toast.from}
            </p>
            <p className="mt-0.5 truncate text-sm font-medium text-slate-700">
              {toast.subject}
            </p>
            {toast.snippet && (
              <p className="truncate text-xs text-slate-400">{toast.snippet}</p>
            )}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="rounded-md p-1 text-slate-300 transition hover:bg-slate-100 hover:text-slate-500"
          >
            <CloseIcon size={16} />
          </button>
        </div>
        <div className="h-1 w-full brand-gradient" />
      </div>
    );
  }

  const tone =
    variant === 'success'
      ? 'text-emerald-600'
      : variant === 'error'
      ? 'text-red-600'
      : 'text-brand-600';

  return (
    <div className="pointer-events-auto flex w-80 animate-toast-in items-start gap-3 rounded-2xl bg-white p-4 shadow-pop ring-1 ring-slate-200/70">
      <span className={`mt-0.5 ${tone}`}>
        {variant === 'success' ? <CheckIcon size={18} /> : <BellIcon size={18} />}
      </span>
      <div className="min-w-0 flex-1">
        {toast.title && (
          <p className="text-sm font-semibold text-slate-800">{toast.title}</p>
        )}
        {toast.message && (
          <p className="text-sm text-slate-500">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="rounded-md p-1 text-slate-300 transition hover:bg-slate-100 hover:text-slate-500"
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
}

export function ToastHost({ toasts = [], onDismiss }) {
  return (
    <div className="pointer-events-none fixed right-5 top-5 z-[60] flex flex-col gap-3">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export default ToastHost;
