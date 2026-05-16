import { formatDate } from '../../../shared/utils/formatDate.js';
import { StatusPill } from '../../../shared/components/StatusPill.jsx';

export function RetryTimeline({ attempts = [] }) {
  if (!attempts || attempts.length === 0) {
    return (
      <div className="text-sm text-slate-400 py-4">No attempts recorded.</div>
    );
  }
  return (
    <ol className="relative border-l-2 border-slate-100 ml-2 space-y-4">
      {attempts.map((a, idx) => (
        <li key={idx} className="ml-4">
          <div className="absolute -left-[7px] w-3 h-3 rounded-full bg-brand-500 ring-4 ring-brand-50" />
          <div className="flex items-center gap-2">
            <StatusPill status={a.status} />
            <span className="text-xs text-slate-500">
              Attempt #{idx + 1} · {formatDate(a.at)}
            </span>
          </div>
          {a.error && (
            <div className="mt-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-lg inline-block">
              {a.error}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
