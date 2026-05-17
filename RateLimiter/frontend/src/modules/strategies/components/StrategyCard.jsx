import { STRATEGY_LABELS, STRATEGY_TYPES } from '../../shared/constants/strategyTypes.js';
import { FixedWindowPreview } from './FixedWindowPreview.jsx';
import { SlidingWindowPreview } from './SlidingWindowPreview.jsx';
import { TokenBucketPreview } from './TokenBucketPreview.jsx';

function PreviewFor({ type }) {
  if (type === STRATEGY_TYPES.FIXED_WINDOW) return <FixedWindowPreview />;
  if (type === STRATEGY_TYPES.SLIDING_WINDOW) return <SlidingWindowPreview />;
  if (type === STRATEGY_TYPES.TOKEN_BUCKET) return <TokenBucketPreview />;
  return null;
}

export function StrategyCard({
  type,
  name,
  description,
  active,
  saving,
  onSelect,
}) {
  return (
    <div
      className={`card p-5 transition border-2 ${
        active ? 'border-brand-500 ring-2 ring-brand-200' : 'border-transparent'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-800">
          {name || STRATEGY_LABELS[type] || type}
        </h3>
        {active && (
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700">
            Active
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 mb-3 min-h-[2.5rem]">{description}</p>
      <PreviewFor type={type} />
      <button
        type="button"
        disabled={active || saving}
        onClick={() => onSelect(type)}
        className={`mt-4 w-full ${active ? 'btn-secondary' : 'btn-primary'} text-sm`}
      >
        {active ? 'Selected' : saving ? 'Switching...' : 'Use this'}
      </button>
    </div>
  );
}

export default StrategyCard;
