import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';

export const VehicleCard = ({ vehicle }) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-xs uppercase text-slate-500">License</div>
        <div className="text-lg font-semibold text-slate-900">{vehicle?.licensePlate}</div>
      </div>
      <Badge tone="info">{vehicle?.type}</Badge>
    </div>
  </Card>
);
