import { buildBarSeries } from '../../shared/utils/chart.util.js';

const WIDTH = 600;
const HEIGHT = 180;
const PAD = 24;

export function UsageHistoryChart({ data = [] }) {
  const { series, maxY } = buildBarSeries(data, 'value');
  if (!series.length) {
    return (
      <div className="text-sm text-slate-400 py-8 text-center">
        No usage history yet
      </div>
    );
  }
  const barW = (WIDTH - PAD * 2) / series.length - 6;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-44">
      {series.map((p, i) => {
        const h = ((p.value || 0) / (maxY || 1)) * (HEIGHT - PAD * 2);
        const x = PAD + i * (barW + 6);
        const y = HEIGHT - PAD - h;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx="3"
              fill="#6366f1"
              opacity="0.85"
            />
            <text
              x={x + barW / 2}
              y={HEIGHT - 6}
              textAnchor="middle"
              fontSize="9"
              fill="#94a3b8"
            >
              {p.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default UsageHistoryChart;
