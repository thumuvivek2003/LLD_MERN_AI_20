import cx from '../../utils/cx.js';
import { initialsOf } from '../../utils/formatters.js';

const SIZES = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-12 w-12 text-sm',
  xl: 'h-14 w-14 text-base',
};

/** Deterministic tint so the same person keeps the same colour across screens. */
const TINTS = [
  'bg-indigo-50 text-indigo-600',
  'bg-emerald-50 text-emerald-600',
  'bg-amber-50 text-amber-600',
  'bg-sky-50 text-sky-600',
  'bg-violet-50 text-violet-600',
  'bg-rose-50 text-rose-600',
];

const tintFor = (seed = '') => {
  const sum = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return TINTS[sum % TINTS.length];
};

export function Avatar({ name, initials, size = 'md', className, tone }) {
  const text = initials || initialsOf(name || '');
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-full font-bold uppercase',
        SIZES[size],
        tone || tintFor(name || text),
        className,
      )}
    >
      {text}
    </span>
  );
}

export default Avatar;
