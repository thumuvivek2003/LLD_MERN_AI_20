import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Loader } from '../../components/ui/Loader.jsx';
import { LotSelect } from '../../features/parking-lot/components/LotSelect.jsx';
import { useSlotsByLot } from '../../features/parking-lot/hooks/useParkingLots.js';
import { useLotStore } from '../../features/parking-lot/state/lot.store.js';
import { SlotStatus } from '../../constants/statuses.js';

const groupByFloor = (slots = []) => {
  const map = new Map();
  for (const s of slots) {
    const floor = s.floorNumber ?? 0;
    if (!map.has(floor)) map.set(floor, { floor, total: 0, occupied: 0 });
    const row = map.get(floor);
    row.total += 1;
    if (s.status === SlotStatus.OCCUPIED) row.occupied += 1;
  }
  return [...map.values()].sort((a, b) => a.floor - b.floor);
};

export function FloorsPage() {
  const lotId = useLotStore((s) => s.selectedLotId);
  const setLotId = useLotStore((s) => s.setSelectedLotId);
  const slots = useSlotsByLot(lotId);

  const floors = groupByFloor(slots.data);

  return (
    <PageContainer title="Floors" subtitle="Per-floor occupancy of the selected lot">
      <Card>
        <LotSelect value={lotId} onChange={setLotId} />
      </Card>

      {!lotId ? null : slots.isLoading ? (
        <Loader label="Loading floors…" />
      ) : floors.length === 0 ? (
        <Card>
          <p className="text-center text-sm text-ink-500">No slots configured yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {floors.map((f) => {
            const pct = Math.round((f.occupied / f.total) * 100);
            return (
              <Card key={f.floor}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-ink-900">
                      Floor {f.floor}
                    </h3>
                    <p className="text-sm text-ink-500">
                      {f.occupied} / {f.total} occupied
                    </p>
                  </div>
                  <Badge tone={pct > 80 ? 'danger' : pct > 50 ? 'warning' : 'success'}>
                    {pct}%
                  </Badge>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-100">
                  <div className="h-full bg-brand-600" style={{ width: `${pct}%` }} />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
