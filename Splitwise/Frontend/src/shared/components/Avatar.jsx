import { initials } from '../utils/format.js';

const PALETTE = [
  'bg-emerald-100 text-emerald-700',
  'bg-teal-100 text-teal-700',
  'bg-sky-100 text-sky-700',
  'bg-indigo-100 text-indigo-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-lime-100 text-lime-700'
];

function pick(name) {
  if (!name) return PALETTE[0];
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export default function Avatar({ name, size = 'md', className = '' }) {
  const sizeCls =
    size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm';
  return (
    <div
      className={`shrink-0 rounded-full flex items-center justify-center font-semibold ${pick(name)} ${sizeCls} ${className}`}
    >
      {initials(name)}
    </div>
  );
}
