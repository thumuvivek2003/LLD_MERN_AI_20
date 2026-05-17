import { buildChartData } from '../../shared/utils/chart.util.js';

const WIDTH = 720;
const HEIGHT = 220;
const PAD = 24;

function buildPath(points, key, maxY) {
  if (!points.length) return '';
  const stepX = (WIDTH - PAD * 2) / Math.max(1, points.length - 1);
  return points
    .map((p, i) => {
      const x = PAD + i * stepX;
      const y =
        HEIGHT - PAD - ((p[key] || 0) / (maxY || 1)) * (HEIGHT - PAD * 2);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

export function TrafficChart({ data = [] }) {
  const { points, maxY } = buildChartData(data);
  if (!points.length) {
    return (
      <div className="text-sm text-slate-400 py-10 text-center">
        No traffic data yet
      </div>
    );
  }
  const allowedPath = buildPath(points, 'allowed', maxY);
  const blockedPath = buildPath(points, 'blocked', maxY);

  return (
    <div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-56"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="allowedFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${allowedPath} L ${WIDTH - PAD} ${HEIGHT - PAD} L ${PAD} ${HEIGHT - PAD} Z`}
          fill="url(#allowedFill)"
        />
        <path d={allowedPath} fill="none" stroke="#6366f1" strokeWidth="2" />
        <path
          d={blockedPath}
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          strokeDasharray="4 3"
        />
      </svg>
      <div className="flex gap-4 text-xs text-slate-500 mt-1">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-3 bg-brand-500 rounded" /> Allowed
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-3 bg-red-500 rounded" /> Blocked
        </span>
      </div>
    </div>
  );
}

export default TrafficChart;
