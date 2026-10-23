import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { VehicleCard } from '../../components/shared/VehicleCard.jsx';
import { Routes } from '../../constants/routes.js';
import { AllocationStrategy } from '../../constants/statuses.js';
import { useParkVehicle } from '../../features/tickets/hooks/useTickets.js';

const STRATEGIES = [
  { id: AllocationStrategy.NEAREST, label: 'Nearest Slot', hint: 'Closest to entry gate' },
  { id: AllocationStrategy.FIRST_AVAILABLE, label: 'First Available', hint: 'Lowest slot number' },
  { id: AllocationStrategy.RANDOM, label: 'Random', hint: 'Distribute evenly' },
];

export function AllocateSlotPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const vehicle = location.state?.vehicle;
  const park = useParkVehicle();

  const [allocation, setAllocation] = useState(AllocationStrategy.NEAREST);

  useEffect(() => {
    if (!vehicle) navigate(Routes.ENTRY_NEW, { replace: true });
  }, [vehicle, navigate]);

  const onConfirm = () => {
    if (!vehicle) return;
    park.mutate(
      {
        lotId: vehicle.lotId,
        licensePlate: vehicle.licensePlate,
        vehicleType: vehicle.vehicleType,
        allocation,
      },
      {
        onSuccess: (ticket) => {
          navigate(Routes.ENTRY_TICKET, {
            state: { ticket, vehicle, allocation },
          });
        },
      }
    );
  };

  const apiError = park.error?.response?.data?.message || park.error?.message;

  return (
    <PageContainer title="Allocate Slot" subtitle="Choose an allocation strategy">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <h3 className="mb-3 text-sm font-semibold text-ink-700">Strategy</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {STRATEGIES.map((s) => {
                const active = allocation === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setAllocation(s.id)}
                    className={[
                      'rounded-xl border p-4 text-left transition',
                      active
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-ink-200 bg-white hover:border-ink-300',
                    ].join(' ')}
                  >
                    <p className={`font-medium ${active ? 'text-brand-700' : 'text-ink-900'}`}>
                      {s.label}
                    </p>
                    <p className="mt-1 text-xs text-ink-500">{s.hint}</p>
                  </button>
                );
              })}
            </div>
          </Card>

          {apiError && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
              {apiError}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <VehicleCard
            vehicle={{
              numberPlate: vehicle?.licensePlate,
              type: vehicle?.vehicleType,
            }}
          />
          <Button
            fullWidth
            size="lg"
            onClick={onConfirm}
            disabled={park.isPending}
            variant="success"
          >
            {park.isPending ? 'Allocating…' : 'Allocate & Generate Ticket'}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
