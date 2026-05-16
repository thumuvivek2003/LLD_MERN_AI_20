import { renderTemplate } from '../../../shared/utils/renderTemplate.js';
import { NotificationPreviewCard } from '../../user/components/NotificationPreviewCard.jsx';

export function TemplatePreviewPane({
  channel,
  subjectTemplate,
  bodyTemplate,
  variables,
}) {
  const subject = renderTemplate(subjectTemplate, variables);
  const body = renderTemplate(bodyTemplate, variables);

  return (
    <div className="card p-4">
      <h4 className="text-sm font-semibold text-slate-900">Live Preview</h4>
      <p className="text-xs text-slate-500 mt-0.5">
        Client-side render — backend re-renders at send time.
      </p>
      <div className="mt-4">
        <NotificationPreviewCard
          channel={channel}
          subject={subject || '—'}
          body={body || '—'}
        />
      </div>
    </div>
  );
}
