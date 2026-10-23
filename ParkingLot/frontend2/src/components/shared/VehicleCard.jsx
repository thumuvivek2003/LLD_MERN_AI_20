import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';

const TYPE_ICON = {
  CAR: '🚗',
  BIKE: '🏍',
  TRUCK: '🚚',
  EV: '⚡',
};

export function VehicleCard({ vehicle }) {
  if (!vehicle) return null;
  return (
    <Card className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl">
        {TYPE_ICON[vehicle.type] || '🚗'}
      </div>
      <div className="flex-1">
        <p className="font-mono text-base font-semibold text-ink-900">
          {vehicle.numberPlate || vehicle.plate || '—'}
        </p>
        <p className="text-xs text-ink-500">{vehicle.description || vehicle.type}</p>
      </div>
      {vehicle.type && <Badge tone="brand">{vehicle.type}</Badge>}
    </Card>
  );
}
