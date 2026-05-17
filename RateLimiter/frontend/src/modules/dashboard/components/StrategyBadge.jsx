import { STRATEGY_LABELS } from '../../shared/constants/strategyTypes.js';

export function StrategyBadge({ strategyType }) {
  const label = STRATEGY_LABELS[strategyType] || strategyType || 'Unknown';
  return (
    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
      {label}
    </span>
  );
}

export default StrategyBadge;
