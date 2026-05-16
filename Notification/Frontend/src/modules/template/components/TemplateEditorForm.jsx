import {
  CHANNELS,
  EVENT_TYPES,
} from '../../../shared/constants/notification.constants.js';

export function TemplateEditorForm({ value, onChange, lockMeta = false }) {
  const update = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="label">Name</label>
          <input
            value={value.name || ''}
            onChange={(e) => update({ name: e.target.value })}
            className="input"
            placeholder="e.g. Payment Success"
            disabled={lockMeta}
          />
        </div>
        <div>
          <label className="label">Event Type</label>
          <select
            value={value.eventType || ''}
            onChange={(e) => update({ eventType: e.target.value })}
            className="input"
            disabled={lockMeta}
          >
            <option value="">Select…</option>
            {EVENT_TYPES.map((ev) => (
              <option key={ev.key} value={ev.key}>
                {ev.label}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="label">Channel</label>
          <div className="flex items-center gap-2">
            {CHANNELS.map((c) => (
              <button
                key={c.key}
                type="button"
                disabled={lockMeta}
                onClick={() => update({ channel: c.key })}
                className={`px-3 py-1.5 text-xs rounded-lg border ${
                  value.channel === c.key
                    ? 'bg-brand-50 border-brand-200 text-brand-700'
                    : 'border-slate-200 text-slate-600'
                } ${lockMeta ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="label">Subject template</label>
        <input
          value={value.subjectTemplate || ''}
          onChange={(e) => update({ subjectTemplate: e.target.value })}
          className="input"
          placeholder="Payment Received"
        />
      </div>

      <div>
        <label className="label">Body template</label>
        <textarea
          value={value.bodyTemplate || ''}
          onChange={(e) => update({ bodyTemplate: e.target.value })}
          rows={8}
          className="input resize-y font-mono text-sm"
          placeholder="Hi {{name}}, your payment of ₹{{amount}} was successful."
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Tip: use <code>{'{{varName}}'}</code> for placeholders.
        </p>
      </div>
    </div>
  );
}
