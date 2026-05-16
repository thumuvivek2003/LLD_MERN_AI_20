import { formatStatus } from '../utils/formatStatus.js';

export function StatusPill({ status }) {
  const meta = formatStatus(status);
  return (
    <span className={`pill ${meta.pillClass}`}>
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
      {meta.label}
    </span>
  );
}
