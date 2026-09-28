import { AlertTriangle, Inbox, Lock, RefreshCw, WifiOff } from 'lucide-react';
import cx from '../../utils/cx.js';
import Button from './Button.jsx';

export function EmptyState({ icon: Icon = Inbox, title, description, action, className, compact }) {
  return (
    <div
      className={cx(
        'flex flex-col items-center justify-center px-6 text-center',
        compact ? 'py-8' : 'py-14',
        className,
      )}
    >
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 ring-1 ring-slate-100">
        <Icon size={22} />
      </span>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Error surface for a failed fetch. Never leaves a blank screen. */
export function ErrorState({ error, onRetry, className, compact }) {
  const isPermission = error?.code === 'PERMISSION_DENIED';
  const isNetwork = error?.code === 'NETWORK_ERROR';
  const Icon = isPermission ? Lock : isNetwork ? WifiOff : AlertTriangle;
  const title = isPermission
    ? 'You do not have access to this'
    : isNetwork
      ? 'Cannot reach the MetaForce API'
      : 'Something went wrong';
  return (
    <div
      className={cx(
        'flex flex-col items-center justify-center px-6 text-center',
        compact ? 'py-8' : 'py-14',
        className,
      )}
    >
      <span
        className={cx(
          'mb-3 flex h-12 w-12 items-center justify-center rounded-xl ring-1',
          isPermission
            ? 'bg-amber-50 text-amber-500 ring-amber-100'
            : 'bg-rose-50 text-rose-500 ring-rose-100',
        )}
      >
        <Icon size={22} />
      </span>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500">
        {error?.message || 'Unexpected error.'}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RefreshCw} className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
