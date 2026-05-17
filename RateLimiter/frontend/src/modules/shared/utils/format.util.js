export function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString();
}

export function formatRelative(value) {
  if (!value) return '-';
  const ts = new Date(value).getTime();
  if (Number.isNaN(ts)) return '-';
  const diff = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function formatPercentage(num, total) {
  if (!total) return '0%';
  return `${Math.round((num / total) * 100)}%`;
}

export function formatNumber(n) {
  if (n == null) return '0';
  return Number(n).toLocaleString();
}
