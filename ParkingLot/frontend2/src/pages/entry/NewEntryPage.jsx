import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { LotSelect } from '../../features/parking-lot/components/LotSelect.jsx';
import { VehicleType } from '../../constants/statuses.js';
import { Routes } from '../../constants/routes.js';
import { isPlate, required } from '../../utils/validators.js';
import { useLotStore } from '../../features/parking-lot/state/lot.store.js';

const TYPES = [
  { id: VehicleType.CAR, label: 'Car', icon: '🚗' },
  { id: VehicleType.BIKE, label: 'Bike', icon: '🏍' },
  { id: VehicleType.TRUCK, label: 'Truck', icon: '🚚' },
];

export function NewEntryPage() {
  const navigate = useNavigate();
  const selectedLotId = useLotStore((s) => s.selectedLotId);
  const setSelectedLotId = useLotStore((s) => s.setSelectedLotId);

  const [form, setForm] = useState({
    licensePlate: '',
    vehicleType: VehicleType.CAR,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!selectedLotId) next.lotId = 'Choose a parking lot';
    if (!isPlate(form.licensePlate)) next.licensePlate = 'Enter a valid plate (4–12 chars)';
    if (!required(form.vehicleType)) next.vehicleType = 'Choose a vehicle type';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onContinue = (e) => {
    e.preventDefault();
    if (!validate()) return;
    navigate(Routes.ENTRY_ALLOCATE, {
      state: { vehicle: { ...form, lotId: selectedLotId } },
    });
  };

  return (
    <PageContainer title="New Entry" subtitle="Enter vehicle details to begin">
      <Card className="mx-auto max-w-2xl">
        <form onSubmit={onContinue} className="space-y-5">
          <LotSelect value={selectedLotId} onChange={setSelectedLotId} />
          {errors.lotId && <p className="-mt-3 text-xs text-red-600">{errors.lotId}</p>}

          <Input
            label="License Plate"
            name="licensePlate"
            placeholder="KA-01-AB-1234"
            value={form.licensePlate}
            onChange={(e) =>
              setForm((p) => ({ ...p, licensePlate: e.target.value.toUpperCase() }))
            }
            error={errors.licensePlate}
          />

          <div>
            <p className="mb-2 text-sm font-medium text-ink-700">Vehicle Type</p>
            <div className="grid grid-cols-3 gap-3">
              {TYPES.map((t) => {
                const active = form.vehicleType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, vehicleType: t.id }))}
                    className={[
                      'flex flex-col items-center gap-1 rounded-xl border p-4 text-sm transition',
                      active
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-ink-200 bg-white text-ink-700 hover:border-ink-300',
                    ].join(' ')}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <span className="font-medium">{t.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.vehicleType && (
              <p className="mt-1 text-xs text-red-600">{errors.vehicleType}</p>
            )}
          </div>

          <Button type="submit" fullWidth size="lg">
            Continue
          </Button>
        </form>
      </Card>
    </PageContainer>
  );
}
