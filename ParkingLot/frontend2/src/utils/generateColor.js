const PALETTE = [
  '#7916ff',
  '#0ea5e9',
  '#16a34a',
  '#f97316',
  '#ec4899',
  '#06b6d4',
  '#facc15',
  '#ef4444',
];

export const generateColor = (seed = '') => {
  if (!seed) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
};
