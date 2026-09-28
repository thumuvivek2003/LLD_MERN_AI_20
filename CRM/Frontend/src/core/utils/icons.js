import * as Lucide from 'lucide-react';
import { Box } from 'lucide-react';

/**
 * Object metadata stores a lucide icon *name* ("users", "shopping-cart").
 * This resolves it to a component, so pages never keep an icon map of their own.
 */
const toPascalCase = (name = '') =>
  name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');

export const resolveIcon = (name, fallback = Box) => {
  if (!name) return fallback;
  return Lucide[toPascalCase(name)] || Lucide[name] || fallback;
};

/** The icon palette offered in the Create Object wizard (matches the mockup row). */
export const OBJECT_ICON_CHOICES = [
  'box',
  'users',
  'building-2',
  'shopping-cart',
  'shopping-bag',
  'receipt',
  'briefcase',
  'file-text',
  'phone',
  'mail',
  'calendar',
  'target',
];

export const OBJECT_COLOR_CHOICES = ['indigo', 'emerald', 'amber', 'rose', 'sky', 'violet'];

/** Tailwind classes for the coloured object tiles — kept static so JIT can see them. */
export const OBJECT_COLOR_CLASSES = {
  indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
  emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  rose: 'bg-rose-50 text-rose-600 ring-rose-100',
  sky: 'bg-sky-50 text-sky-600 ring-sky-100',
  violet: 'bg-violet-50 text-violet-600 ring-violet-100',
  slate: 'bg-slate-100 text-slate-600 ring-slate-200',
};

export const objectColorClass = (color) => OBJECT_COLOR_CLASSES[color] || OBJECT_COLOR_CLASSES.slate;
