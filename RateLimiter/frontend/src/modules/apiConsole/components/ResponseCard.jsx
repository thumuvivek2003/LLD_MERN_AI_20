import { StrategyBadge } from '../../dashboard/components/StrategyBadge.jsx';

export function ResponseCard({ result, error }) {
  if (error) {
    return (
      <div className="card p-5 border-l-4 border-red-500">
        <div className="text-xs uppercase text-red-600 font-medium">Error</div>
        <div className="text-sm text-slate-700 mt-2">{error}</div>
      </div>
    );
  }
  if (!result) {
    return (
      <div className="card p-5 text-sm text-slate-400">
        Send a request to see the response.
      </div>
    );
  }
  const allowed = !!result.body?.allowed;
  return (
    <div
      className={`card p-5 border-l-4 ${
        allowed ? 'border-emerald-500' : 'border-red-500'
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs uppercase font-bold ${
            allowed ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {allowed ? 'Allowed' : 'Blocked'}
        </span>
        <span className="text-xs text-slate-400">HTTP {result.status}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-[11px] uppercase text-slate-500">Remaining</div>
          <div className="font-medium text-slate-800">
            {result.body?.remainingTokens ?? '-'}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-slate-500">Resets in</div>
          <div className="font-medium text-slate-800">
            {result.body?.resetAfterSeconds ?? '-'}s
          </div>
        </div>
      </div>
      <div className="mt-3">
        <StrategyBadge strategyType={result.body?.strategy} />
      </div>
      {result.body?.message && (
        <div className="text-xs text-slate-500 mt-3">
          {result.body.message}
        </div>
      )}
      <pre className="mt-3 bg-slate-900 text-slate-50 text-xs rounded-lg p-3 overflow-auto max-h-48">
        {JSON.stringify(result.body, null, 2)}
      </pre>
    </div>
  );
}

export default ResponseCard;
