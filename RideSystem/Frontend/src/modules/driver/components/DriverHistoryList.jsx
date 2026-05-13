import RideCard from '../../../core/components/ride/RideCard.jsx';

export default function DriverHistoryList({ rides, onOpen }) {
  if (!rides?.length) return <div className="text-center text-slate-400 py-10">No rides yet</div>;
  return (
    <div className="space-y-3">
      {rides.map((r) => <RideCard key={r.id} ride={r} onClick={() => onOpen?.(r)} />)}
    </div>
  );
}
