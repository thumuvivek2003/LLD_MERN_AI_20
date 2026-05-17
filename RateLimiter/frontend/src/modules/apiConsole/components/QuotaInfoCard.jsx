import { UsageProgress } from '../../dashboard/components/UsageProgress.jsx';
import { StrategyBadge } from '../../dashboard/components/StrategyBadge.jsx';

export function QuotaInfoCard({ usage }) {
  if (!usage) {
    return (
      <div className="card p-5 text-sm text-slate-400">
        Quota info will appear after first request.
      </div>
    );
  }
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Your Quota</h3>
        <StrategyBadge strategyType={usage.strategy} />
      </div>
      <UsageProgress
        remaining={usage.remainingTokens || 0}
        total={Math.max(usage.remainingTokens || 0, 100)}
        label="tokens remaining"
      />
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-[11px] uppercase text-slate-500">Allowed</div>
          <div className="font-medium text-emerald-600">
            {usage.allowed ?? 0}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-slate-500">Blocked</div>
          <div className="font-medium text-red-600">{usage.blocked ?? 0}</div>
        </div>
      </div>
    </div>
  );
}

export default QuotaInfoCard;
