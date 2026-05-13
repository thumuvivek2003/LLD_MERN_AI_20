import Card from '../../../core/components/ui/Card.jsx';

export default function DriverInfoCard({ driver, vehicle }) {
  if (!driver) return null;
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-slate-200 grid place-items-center text-xl font-bold">
          {driver.name?.[0]}
        </div>
        <div className="flex-1">
          <p className="font-semibold">{driver.name}</p>
          <p className="text-xs text-slate-500">⭐ {driver.rating?.toFixed?.(1) || '5.0'} · {driver.phone || ''}</p>
          {vehicle && (
            <p className="text-xs mt-1">
              <span className="font-medium">{vehicle.model}</span>
              <span className="text-slate-400"> · </span>
              <span className="font-mono">{vehicle.numberPlate}</span>
            </p>
          )}
        </div>
        <a href={`tel:${driver.phone || ''}`} className="px-3 py-2 rounded-full bg-brand text-white text-sm font-semibold">Call</a>
      </div>
    </Card>
  );
}
