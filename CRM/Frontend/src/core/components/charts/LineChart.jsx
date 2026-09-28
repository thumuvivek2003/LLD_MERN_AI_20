import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as ReLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AXIS, TOOLTIP_STYLE, colorAt } from './palette.js';

/**
 * Multi-series time chart. `series` = `[{ key, label }]`, `data` = `[{ t, cpu, memory }]`.
 * Used by System → Metrics and the dashboard's performance panel.
 */
export function LineChart({ data = [], series = [], height = 220, xKey = 't', unit = '' }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReLineChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid stroke={AXIS.stroke} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={xKey} tick={AXIS.tick} tickLine={false} axisLine={{ stroke: AXIS.stroke }} minTickGap={24} />
        <YAxis
          tick={AXIS.tick}
          tickLine={false}
          axisLine={false}
          width={44}
          tickFormatter={(value) => `${value}${unit}`}
        />
        <Tooltip {...TOOLTIP_STYLE} formatter={(value, name) => [`${value}${unit}`, name]} />
        {series.length > 1 && (
          <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
        )}
        {series.map((item, index) => (
          <Line
            key={item.key}
            type="monotone"
            dataKey={item.key}
            name={item.label}
            stroke={item.color || colorAt(index)}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3.5 }}
            isAnimationActive={false}
          />
        ))}
      </ReLineChart>
    </ResponsiveContainer>
  );
}

export default LineChart;
