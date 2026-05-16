import { Link } from 'react-router-dom';
import { CHANNELS } from '../../../shared/constants/notification.constants.js';

export function TemplateCard({ template }) {
  const channelMeta =
    CHANNELS.find((c) => c.key === template.channel) || CHANNELS[0];

  return (
    <Link
      to={`/templates/${template.id}`}
      className="card p-5 block hover:shadow-soft transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            {template.name}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">{template.eventType}</p>
        </div>
        <span className={`pill ${channelMeta.color}`}>{channelMeta.label}</span>
      </div>
      <div className="mt-4 text-xs text-slate-500 flex items-center justify-between">
        <span>v{template.activeVersion}</span>
        <span>{template.versions?.length || 1} version(s)</span>
      </div>
    </Link>
  );
}
