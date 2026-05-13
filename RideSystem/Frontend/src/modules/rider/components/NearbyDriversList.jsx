import Card from '../../../core/components/ui/Card.jsx';

export default function NearbyDriversList({ drivers = [] }) {
  if (!drivers.length) return <Card><p className="text-sm text-slate-500">No drivers nearby right now</p></Card>;
  return (
    <div className="space-y-2">
      {drivers.map((d) => (
        <Card key={d.id} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 grid place-items-center font-bold">{d.user?.name?.[0] || 'D'}</div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{d.user?.name}</p>
            <p className="text-xs text-slate-500">{d.activeVehicle?.model || 'Vehicle'} · ⭐ {d.rating?.toFixed?.(1) || '5.0'}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
