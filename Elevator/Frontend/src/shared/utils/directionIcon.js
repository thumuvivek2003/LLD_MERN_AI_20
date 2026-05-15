import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { DIRECTION } from '../constants/direction.js';

export function getDirectionIcon(direction) {
  if (direction === DIRECTION.UP) return ArrowUp;
  if (direction === DIRECTION.DOWN) return ArrowDown;
  return Minus;
}

export function getDirectionColor(direction) {
  if (direction === DIRECTION.UP) return 'text-emerald-400';
  if (direction === DIRECTION.DOWN) return 'text-rose-400';
  return 'text-slate-400';
}
