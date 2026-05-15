const PALETTE = {
  E1: { ring: 'ring-indigo-500', bg: 'bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500/40', soft: 'bg-indigo-500/10' },
  E2: { ring: 'ring-emerald-500', bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/40', soft: 'bg-emerald-500/10' },
  E3: { ring: 'ring-amber-500', bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/40', soft: 'bg-amber-500/10' },
  E4: { ring: 'ring-rose-500', bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/40', soft: 'bg-rose-500/10' },
};

export function getElevatorColor(id) {
  return PALETTE[id] || PALETTE.E1;
}
