import Card from '../../../core/components/ui/Card.jsx';
import RideStatusBadge from '../../../core/components/ride/RideStatusBadge.jsx';

export default function RideTrackingCard({ ride }) {
  if (!ride) return null;
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold">Trip status</p>
        <RideStatusBadge status={ride.status} />
      </div>
      <div className="space-y-1.5 text-sm">
        <div className="flex gap-2"><span className="text-emerald-500">●</span><span className="text-slate-600">{ride.pickup?.address || 'Pickup'}</span></div>
        <div className="flex gap-2"><span className="text-red-500">●</span><span className="text-slate-600">{ride.drop?.address || 'Drop'}</span></div>
      </div>
    </Card>
  );
}
