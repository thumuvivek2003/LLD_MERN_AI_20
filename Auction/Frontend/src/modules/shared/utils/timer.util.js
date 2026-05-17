export function calculateRemainingTime(endTime) {
  if (!endTime) return { total: 0, hh: '00', mm: '00', ss: '00', expired: true };
  const total = new Date(endTime).getTime() - Date.now();
  if (total <= 0) return { total: 0, hh: '00', mm: '00', ss: '00', expired: true };

  const totalSeconds = Math.floor(total / 1000);
  const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const ss = String(totalSeconds % 60).padStart(2, '0');

  return { total, hh, mm, ss, expired: false };
}

export function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  return d.toLocaleString();
}
