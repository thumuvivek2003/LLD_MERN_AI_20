import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { parkingService } from '../../services/parking.service.js';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Routes as R } from '../../constants/routes.js';
import { VehicleType } from '../../constants/statuses.js';
import { required } from '../../utils/validators.js';

export const NewEntryPage = () => {
  const navigate = useNavigate();
  const { data: lots = [] } = useQuery({ queryKey: ['lots'], queryFn: parkingService.listLots });
  const [form, setForm] = useState({ lotId: '', licensePlate: '', vehicleType: VehicleType.CAR });
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const next = {};
    if (!required(form.lotId)) next.lotId = 'Select a lot';
    if (!required(form.licensePlate)) next.licensePlate = 'License plate is required';
    setErrors(next);
    if (Object.keys(next).length) return;
    navigate(R.ENTRY.ALLOCATE, { state: form });
  };

  return (
    <PageContainer title="New Entry" subtitle="Step 1 of 3 — Vehicle details">
      <Card className="max-w-2xl">
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Parking lot</label>
            <select
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={form.lotId}
              onChange={(e) => setForm({ ...form, lotId: e.target.value })}
            >
              <option value="">— Choose a lot —</option>
              {lots.map((l) => (
                <option key={l._id} value={l._id}>{l.name}</option>
              ))}
            </select>
            {errors.lotId && <span className="text-xs text-rose-600">{errors.lotId}</span>}
          </div>

          <Input
            label="License plate"
            placeholder="KA-01-AB-1234"
            value={form.licensePlate}
            onChange={(e) => setForm({ ...form, licensePlate: e.target.value.toUpperCase() })}
            error={errors.licensePlate}
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

          <div className="flex justify-end">
            <Button onClick={handleNext}>Continue</Button>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};
