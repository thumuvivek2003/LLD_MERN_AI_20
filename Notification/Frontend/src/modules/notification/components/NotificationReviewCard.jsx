import { Card } from '../../../shared/components/Card.jsx';
import { CHANNELS } from '../../../shared/constants/notification.constants.js';

export function NotificationReviewCard({ composer, templateMeta }) {
  return (
    <Card title="Review">
      <dl className="grid grid-cols-2 gap-y-2 text-sm">
        <dt className="text-slate-500">Mode</dt>
        <dd className="font-medium">
          {composer.mode === 'group' ? 'Group send' : 'Single send'}
        </dd>
        <dt className="text-slate-500">Recipients</dt>
        <dd className="font-medium">{composer.audience.length} user(s)</dd>
        <dt className="text-slate-500">Channels</dt>
        <dd className="font-medium">
          {composer.channels.map((c) => {
            const meta = CHANNELS.find((x) => x.key === c);
            return (
              <span key={c} className={`pill ${meta?.color || ''} mr-1`}>
                {meta?.label || c}
              </span>
            );
          })}
          {composer.channels.length === 0 && (
            <span className="text-slate-400">None</span>
          )}
        </dd>
        <dt className="text-slate-500">Template</dt>
        <dd className="font-medium">
          {templateMeta?.name || composer.templateId || 'None'}
        </dd>
      </dl>
      <div className="mt-4">
        <div className="text-xs text-slate-500 mb-1">Payload</div>
        <pre className="text-xs bg-slate-50 rounded-xl p-3 overflow-x-auto border border-slate-100">
          {JSON.stringify(composer.payload || {}, null, 2)}
        </pre>
      </div>
    </Card>
  );
}
