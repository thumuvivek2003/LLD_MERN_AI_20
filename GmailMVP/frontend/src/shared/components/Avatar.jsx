import { initials as toInitials } from '../utils/formatter.js';

const SIZES = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl',
};

export default function Avatar({
  name = '',
  color = '#6366f1',
  size = 'md',
  ring = false,
  className = '',
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white shadow-sm ${
        SIZES[size]
      } ${ring ? 'ring-2 ring-white' : ''} ${className}`}
      style={{ backgroundColor: color }}
      title={name}
      aria-label={name}
    >
      {toInitials(name)}
    </span>
  );
}
