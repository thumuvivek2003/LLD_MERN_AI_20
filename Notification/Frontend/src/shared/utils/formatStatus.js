import { STATUS_META } from '../constants/status.constants.js';

// Map a raw status string to its label / pill classes (OCP via dictionary).
export function formatStatus(status) {
  const meta = STATUS_META[status];
  if (!meta) {
    return {
      label: status || 'Unknown',
      pillClass: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
      dotClass: 'bg-slate-400',
    };
  }
  return meta;
}
