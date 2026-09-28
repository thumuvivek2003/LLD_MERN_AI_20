import {
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AXIS, TOOLTIP_STYLE, colorAt } from './palette.js';

/** Single-series categorical bars — Reports aggregations and log/level breakdowns. */
export function BarChart({
  data = [],
  xKey = 'label',
  yKey = 'value',
  height = 240,
  layout = 'vertical',
  colored = false,
}) {
  const horizontal = layout === 'horizontal';
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 6, right: 16, bottom: 0, left: horizontal ? 8 : -18 }}
      >
        <CartesianGrid stroke={AXIS.stroke} strokeDasharray="3 3" vertical={horizontal} horizontal={!horizontal} />
        {horizontal ? (
          <>
            <XAxis type="number" tick={AXIS.tick} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey={xKey}
              tick={AXIS.tick}
              tickLine={false}
              axisLine={false}
              width={120}
            />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} tick={AXIS.tick} tickLine={false} axisLine={{ stroke: AXIS.stroke }} />
            <YAxis tick={AXIS.tick} tickLine={false} axisLine={false} width={52} />
          </>
        )}
        <Tooltip {...TOOLTIP_STYLE} cursor={{ fill: '#F1F5F9' }} />
        <Bar dataKey={yKey} radius={horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]} maxBarSize={34} isAnimationActive={false}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color || (colored ? colorAt(index) : colorAt(0))} />
          ))}
        </Bar>
      </ReBarChart>
    </ResponsiveContainer>
  );
}

export default BarChart;
