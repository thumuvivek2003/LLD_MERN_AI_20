import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { TOOLTIP_STYLE, colorAt } from './palette.js';

/**
 * Donut with a centred value — the cache hit-rate ring and the log-level counters.
 * `data` = `[{ label, value, color }]`.
 */
export function DonutChart({
  data = [],
  height = 200,
  innerRadius = '68%',
  outerRadius = '92%',
  centerValue,
  centerLabel,
  showTooltip = true,
}) {
  const total = data.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  const slices = total > 0 ? data : [{ label: 'No data', value: 1, color: '#E2E8F0' }];
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={slices}
            dataKey="value"
            nameKey="label"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={total > 0 && slices.length > 1 ? 2 : 0}
            stroke="none"
            isAnimationActive={false}
          >
            {slices.map((entry, index) => (
              <Cell key={index} fill={entry.color || colorAt(index)} />
            ))}
          </Pie>
          {showTooltip && total > 0 && <Tooltip {...TOOLTIP_STYLE} />}
        </PieChart>
      </ResponsiveContainer>
      {(centerValue !== undefined || centerLabel) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{centerValue}</span>
          {centerLabel && <span className="mt-0.5 text-[11px] text-slate-500">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}

export default DonutChart;
