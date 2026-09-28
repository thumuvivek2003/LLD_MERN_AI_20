/** One categorical palette for every chart in the app — consistent series colours. */
export const SERIES_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#38BDF8', '#F43F5E', '#8B5CF6'];

export const AXIS = {
  stroke: '#E2E8F0',
  tick: { fill: '#94A3B8', fontSize: 11 },
};

export const TOOLTIP_STYLE = {
  contentStyle: {
    borderRadius: 10,
    border: '1px solid #E2E8F0',
    boxShadow: '0 10px 30px -12px rgb(15 23 42 / 0.25)',
    fontSize: 12,
    padding: '8px 10px',
  },
  labelStyle: { color: '#0F172A', fontWeight: 600, marginBottom: 2 },
  itemStyle: { color: '#475569' },
};

export const colorAt = (index) => SERIES_COLORS[index % SERIES_COLORS.length];
