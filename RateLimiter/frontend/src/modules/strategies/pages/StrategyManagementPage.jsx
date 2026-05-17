import { useState } from 'react';
import { useStrategies, useUpdateStrategy } from '../hooks/useStrategy.js';
import { StrategyCard } from '../components/StrategyCard.jsx';
import { Loader } from '../../shared/components/Loader.jsx';
import { EmptyState } from '../../shared/components/EmptyState.jsx';
import {
  STRATEGY_DESCRIPTIONS,
  STRATEGY_LABELS,
  STRATEGY_TYPES,
} from '../../shared/constants/strategyTypes.js';

const FALLBACK_AVAILABLE = Object.values(STRATEGY_TYPES).map((type) => ({
  type,
  name: STRATEGY_LABELS[type],
  description: STRATEGY_DESCRIPTIONS[type],
}));

export function StrategyManagementPage() {
  const { data, loading, error, refresh } = useStrategies();
  const { update, saving, error: saveError } = useUpdateStrategy();
  const [localActive, setLocalActive] = useState(null);

  if (loading) return <Loader />;

  const active = localActive || data?.active;
  const available =
    data?.available && data.available.length > 0
      ? data.available
      : FALLBACK_AVAILABLE;

  const handleSelect = async (type) => {
    try {
      const res = await update(type);
      setLocalActive(res?.active || type);
      refresh();
    } catch (_) {
      // surfaced via saveError
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <EmptyState
          title="Could not load strategies"
          description={`${error} — showing defaults`}
        />
      )}
      {saveError && (
        <div className="text-sm text-red-600">{saveError}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {available.map((s) => (
          <StrategyCard
            key={s.type}
            type={s.type}
            name={s.name}
            description={s.description || STRATEGY_DESCRIPTIONS[s.type]}
            active={s.type === active}
            saving={saving}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}

export default StrategyManagementPage;
