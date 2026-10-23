import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Loader } from '../../components/ui/Loader.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { SlotCard } from '../../components/shared/SlotCard.jsx';
import { LotSelect } from '../../features/parking-lot/components/LotSelect.jsx';
import { useSlotsByLot } from '../../features/parking-lot/hooks/useParkingLots.js';
import { useLotStore } from '../../features/parking-lot/state/lot.store.js';
import { SlotStatus } from '../../constants/statuses.js';
import { parkingService } from '../../services/parking.service.js';

const FILTERS = ['ALL', SlotStatus.AVAILABLE, SlotStatus.OCCUPIED, SlotStatus.MAINTENANCE];

export function SlotsPage() {
  const lotId = useLotStore((s) => s.selectedLotId);
  const setLotId = useLotStore((s) => s.setSelectedLotId);
  const [filter, setFilter] = useState('ALL');

  const slots = useSlotsByLot(lotId);
  const qc = useQueryClient();

  const toggleMaintenance = useMutation({
    mutationFn: ({ slotId: id, on }) => parkingService.setSlotMaintenance(id, on),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['slots-by-lot'] }),
  });

  const data = slots.data ?? [];
  const filtered = data.filter((s) => filter === 'ALL' || s.status === filter);

  const onSlotClick = (slot) => {
    if (slot.status === SlotStatus.OCCUPIED) return;
    const id = slot._id || slot.id;
    const goingToMaintenance = slot.status !== SlotStatus.MAINTENANCE;
    toggleMaintenance.mutate({ slotId: id, on: goingToMaintenance });
  };

  return (
    <PageContainer
      title="Slots"
      subtitle="Live floor view — click a slot to toggle maintenance"
      actions={<Button>+ Add Slot</Button>}
    >
      <Card>
        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-[1fr,auto]">
          <LotSelect value={lotId} onChange={setLotId} />
          <div className="flex flex-wrap items-end gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={[
                  'rounded-full px-3.5 py-1.5 text-xs font-medium transition',
                  filter === f
                    ? 'bg-brand-700 text-white'
                    : 'bg-ink-100 text-ink-700 hover:bg-ink-200',
                ].join(' ')}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {!lotId ? (
          <p className="py-10 text-center text-sm text-ink-500">Select a lot to view slots.</p>
        ) : slots.isLoading ? (
          <Loader label="Loading slots…" />
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink-500">
            No slots in this view.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filtered.map((s) => (
              <SlotCard
                key={s._id || s.id}
                slot={{
                  code: s.code || `${s.floorNumber ?? '?'}-${String(s.slotNumber ?? '').padStart(2, '0')}`,
                  vehicleType: s.vehicleType,
                  floor: s.floorNumber,
                  status: s.status,
                }}
                onClick={() => onSlotClick(s)}
              />
            ))}
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
