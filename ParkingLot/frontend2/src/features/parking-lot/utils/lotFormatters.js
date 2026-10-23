export const formatLotAddress = (lot) => {
  if (!lot) return '—';
  const parts = [lot.address, lot.city, lot.state, lot.pincode].filter(Boolean);
  return parts.length ? parts.join(', ') : '—';
};

export const computeOccupancy = ({ total = 0, occupied = 0 }) => {
  if (!total) return { ratio: 0, percentage: '0%' };
  const ratio = occupied / total;
  return { ratio, percentage: `${Math.round(ratio * 100)}%` };
};
