// Minimal Tailwind+SVG sparkline. Avoids adding a chart library for the MVP.
export default function RevenueChart({ data = [] }) {
  const points = data.length
    ? data
    : [12, 25, 18, 40, 35, 50, 60, 48, 70, 65, 80, 95];

  const width = 600;
  const height = 180;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = Math.max(1, max - min);
  const stepX = width / (points.length - 1);

  const pathD = points
    .map((p, i) => {
      const x = i * stepX;
      const y = height - ((p - min) / range) * (height - 20) - 10;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-800">Revenue trend</h3>
          <p className="text-xs text-slate-500">Last 12 closed auctions</p>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
        <defs>
          <linearGradient id="rev-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#rev-grad)" />
        <path d={pathD} fill="none" stroke="#7c3aed" strokeWidth="2.5" />
      </svg>
    </div>
  );
}
