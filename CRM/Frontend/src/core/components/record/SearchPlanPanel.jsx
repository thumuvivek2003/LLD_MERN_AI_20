import { Gauge, Zap } from 'lucide-react';
import Badge from '../ui/Badge.jsx';

/**
 * Renders the `plan` the search endpoint always returns — which index served each
 * predicate, how many docs matched, and how long the whole query took.
 */
export function SearchPlanPanel({ plan }) {
  if (!plan) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl bg-slate-50 px-4 py-3">
      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        <Zap size={13} className="text-amber-500" />
        {plan.strategy}
      </span>
      <span className="flex items-center gap-1.5 text-xs text-slate-500">
        <Gauge size={13} className="text-slate-400" />
        {plan.tookMs} ms · {plan.scanned ?? 0} scanned
      </span>
      {plan.steps?.length > 0 && (
        <span className="flex flex-wrap items-center gap-1.5">
          {plan.steps.map((step, index) => (
            <Badge key={index} tone={step.op ? 'violet' : 'sky'}>
              {step.op ? step.op : `${step.fieldId} · ${step.index}`} → {step.matched}
            </Badge>
          ))}
        </span>
      )}
    </div>
  );
}

export default SearchPlanPanel;
