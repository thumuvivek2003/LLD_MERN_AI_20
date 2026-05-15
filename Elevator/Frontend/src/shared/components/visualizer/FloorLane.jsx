export default function FloorLane({ floorHeight = 36, isLast = false }) {
  return (
    <div
      className={isLast ? '' : 'border-b border-slate-700/40'}
      style={{ height: floorHeight }}
    />
  );
}
