import { formatFloor } from './floorFormatter.js';

export function formatRequestRoute(req) {
  const from = formatFloor(req.fromFloor ?? req.floor);
  const to = req.toFloor != null ? formatFloor(req.toFloor) : null;
  return to != null ? `Floor ${from} → Floor ${to}` : `Floor ${from}`;
}

export function formatEta(seconds) {
  if (seconds == null) return '—';
  if (seconds < 60) return `${seconds}s`;
  return `${Math.round(seconds / 60)}m`;
}
