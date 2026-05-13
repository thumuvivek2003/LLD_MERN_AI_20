// Lightweight visual "map" without external libs.
// Renders pickup, drop, and an optional driver marker as a stylized scene.
export default function RouteMap({ pickup, drop, driver, height = 220 }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-slate-100 bg-gradient-to-br from-slate-100 to-slate-50"
      style={{ height }}
    >
      <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <path d="M50,160 C120,140 180,80 350,40" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
      <Marker x="10%" y="76%" color="#10B981" label={pickup?.address || 'Pickup'} />
      <Marker x="86%" y="20%" color="#EF4444" label={drop?.address || 'Drop'} />
      {driver && <Marker x="40%" y="55%" color="#0F172A" label="Driver" car />}
    </div>
  );
}

function Marker({ x, y, color, label, car }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y }}>
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full" style={{ background: color }} />
        <span className="text-[10px] bg-white/80 px-1.5 py-0.5 rounded-md font-medium">
          {car ? '🚗 ' : ''}{label}
        </span>
      </div>
    </div>
  );
}
