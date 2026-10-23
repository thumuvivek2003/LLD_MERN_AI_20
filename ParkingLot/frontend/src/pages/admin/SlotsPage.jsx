import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parkingService } from '../../services/parking.service.js';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Loader } from '../../components/ui/Loader.jsx';
import { SlotCard } from '../../components/shared/SlotCard.jsx';
import { VehicleType } from '../../constants/statuses.js';

export const SlotsPage = () => {
  const qc = useQueryClient();
  const [lotId, setLotId] = useState('');
  const [form, setForm] = useState({ floorNumber: 1, slotNumber: 1, vehicleType: VehicleType.CAR });

  const { data: lots = [] } = useQuery({ queryKey: ['lots'], queryFn: parkingService.listLots });
  const { data: slots = [], isFetching } = useQuery({
    queryKey: ['slots', lotId],
    queryFn: () => parkingService.listSlotsByLot(lotId),
    enabled: !!lotId,
  });

  const add = useMutation({
    mutationFn: parkingService.addSlot,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['slots', lotId] }),
  });

  const maintenance = useMutation({
    mutationFn: parkingService.setSlotMaintenance,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['slots', lotId] }),
  });

  return (
    <PageContainer title="Slots" subtitle="Add slots and manage status">
      <Card title="Select lot">
        <select
          className="w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={lotId}
          onChange={(e) => setLotId(e.target.value)}
        >
          <option value="">— Choose a lot —</option>
          {lots.map((l) => (
            <option key={l._id} value={l._id}>{l.name}</option>
          ))}
        </select>
      </Card>

      {lotId && (
        <Card title="Add slot">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <Input
              label="Floor"
              type="number"
              value={form.floorNumber}
              onChange={(e) => setForm({ ...form, floorNumber: Number(e.target.value) })}
            />
            <Input
              label="Slot #"
              type="number"
              value={form.slotNumber}
              onChange={(e) => setForm({ ...form, slotNumber: Number(e.target.value) })}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Vehicle type</label>
              <select
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={form.vehicleType}
                onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
              >
                {Object.values(VehicleType).map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                className="w-full"
                onClick={() => add.mutate({ lotId, ...form })}
                disabled={add.isPending}
              >
                {add.isPending ? 'Adding...' : 'Add slot'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isFetching ? (
        <Loader />
      ) : (
        lotId && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {slots.map((s) => (
              <SlotCard key={s._id} slot={s} onClick={() => maintenance.mutate(s._id)} />
            ))}
          </div>
        )
      )}
    </PageContainer>
  );
};
