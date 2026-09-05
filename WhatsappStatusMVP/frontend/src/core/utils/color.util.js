// core/utils/color.util.js — deterministic avatar colors + initials.
const PALETTE = ['#0ea5a4', '#8b5cf6', '#ef4444', '#f59e0b', '#3b82f6', '#ec4899', '#10b981', '#6366f1'];

export function colorForId(id = '') {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

export function initials(name = '') {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
}

export const statusBgClass = (key) => `bg-status-${key || 'teal'}`;
