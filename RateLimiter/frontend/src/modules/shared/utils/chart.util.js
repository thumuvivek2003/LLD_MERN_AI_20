export function buildChartData(points = [], { allowedKey = 'allowed', blockedKey = 'blocked' } = {}) {
  if (!Array.isArray(points) || points.length === 0) {
    return { points: [], maxY: 0 };
  }
  const maxY = points.reduce((m, p) => {
    const v = (p[allowedKey] || 0) + (p[blockedKey] || 0);
    return v > m ? v : m;
  }, 0);
  return { points, maxY };
}

export function buildBarSeries(points = [], key = 'value') {
  if (!Array.isArray(points) || points.length === 0) return { series: [], maxY: 0 };
  const maxY = points.reduce((m, p) => Math.max(m, p[key] || 0), 0);
  return { series: points, maxY };
}
