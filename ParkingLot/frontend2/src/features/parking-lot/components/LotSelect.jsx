import { useEffect } from 'react';
import { useParkingLots } from '../hooks/useParkingLots.js';
import { useLotStore } from '../state/lot.store.js';

export function LotSelect({ value, onChange, label = 'Parking Lot' }) {
  const { data: lots = [], isLoading } = useParkingLots();
  const storeId = useLotStore((s) => s.selectedLotId);
  const setStoreId = useLotStore((s) => s.setSelectedLotId);

  const current = value ?? storeId;

  useEffect(() => {
    if (!current && lots.length > 0) {
      const first = lots[0]._id || lots[0].id;
      onChange ? onChange(first) : setStoreId(first);
    }
  }, [current, lots, onChange, setStoreId]);

  const handle = (id) => (onChange ? onChange(id) : setStoreId(id));

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-ink-700">{label}</label>
      )}
      <select
        value={current || ''}
        onChange={(e) => handle(e.target.value)}
        disabled={isLoading || lots.length === 0}
        className="block w-full rounded-lg border border-ink-200 bg-white px-3.5 h-11 text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-400"
      >
        {lots.length === 0 && <option value="">No lots configured</option>}
        {lots.map((lot) => {
          const id = lot._id || lot.id;
          return (
            <option key={id} value={id}>
              {lot.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
