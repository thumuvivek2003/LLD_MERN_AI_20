import {
  CHANNELS,
  EVENT_TYPES,
} from '../../../shared/constants/notification.constants.js';
import { NOTIFICATION_STATUS } from '../../../shared/constants/status.constants.js';

export function NotificationFilterBar({ filters, onChange, onReset }) {
  return (
    <div className="card p-3 flex flex-wrap items-center gap-3">
      <select
        value={filters.status || ''}
        onChange={(e) => onChange({ status: e.target.value })}
        className="input w-40"
      >
        <option value="">All statuses</option>
        {Object.values(NOTIFICATION_STATUS).map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select
        value={filters.channel || ''}
        onChange={(e) => onChange({ channel: e.target.value })}
        className="input w-40"
      >
        <option value="">All channels</option>
        {CHANNELS.map((c) => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </select>
      <select
        value={filters.eventType || ''}
        onChange={(e) => onChange({ eventType: e.target.value })}
        className="input w-48"
      >
        <option value="">All events</option>
        {EVENT_TYPES.map((ev) => (
          <option key={ev.key} value={ev.key}>
            {ev.label}
          </option>
        ))}
      </select>
      <button onClick={onReset} className="btn-ghost text-xs">
        Reset
      </button>
    </div>
  );
}
