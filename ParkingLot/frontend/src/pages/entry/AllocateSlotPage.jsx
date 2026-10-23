import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { parkingService } from '../../services/parking.service.js';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Routes as R } from '../../constants/routes.js';

const STRATEGIES = [
  { key: 'NEAREST', name: 'Nearest', description: 'Pick the slot closest to the entrance.' },
  { key: 'FIRST', name: 'First Available', description: 'Pick the first matching free slot.' },
  { key: 'RANDOM', name: 'Random', description: 'Pick any free slot at random.' },
];

export const AllocateSlotPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const entry = location.state;
  const [allocation, setAllocation] = useState('NEAREST');

  const park = useMutation({
    mutationFn: parkingService.park,
    onSuccess: (ticket) => navigate(R.ENTRY.TICKET, { state: ticket, replace: true }),
  });

  if (!entry) return <Navigate to={R.ENTRY.NEW} replace />;

  return (
    <PageContainer title="Allocate Slot" subtitle="Step 2 of 3 — Choose allocation strategy">
      <div className="grid gap-3 sm:grid-cols-3">
        {STRATEGIES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setAllocation(s.key)}
            className={`rounded-lg border p-4 text-left transition ${
              allocation === s.key
                ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200'
                : 'border-slate-200 bg-white hover:border-brand-300'
            }`}
          >
            <div className="font-semibold text-slate-900">{s.name}</div>
            <div className="mt-1 text-xs text-slate-600">{s.description}</div>
          </button>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            <div><span className="text-slate-500">Plate:</span> <b>{entry.licensePlate}</b></div>
            <div><span className="text-slate-500">Type:</span> {entry.vehicleType}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
            <Button onClick={() => park.mutate({ ...entry, allocation })} disabled={park.isPending}>
              {park.isPending ? 'Allocating...' : 'Park vehicle'}
            </Button>
          </div>
        </div>
        {park.error && (
          <div className="mt-3 rounded bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {park.error.error || 'Failed to allocate slot'}
          </div>
        )}
      </Card>
    </PageContainer>
  );
};
