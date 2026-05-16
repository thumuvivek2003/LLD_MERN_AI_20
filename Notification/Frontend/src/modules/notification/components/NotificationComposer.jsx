import { ChannelSelector } from './ChannelSelector.jsx';
import { TemplateSelector } from './TemplateSelector.jsx';
import { AudienceSelector } from './AudienceSelector.jsx';
import { Card } from '../../../shared/components/Card.jsx';
import { useNotificationComposer } from '../hooks/useNotificationComposer.js';

export function NotificationComposer({ mode = 'single' }) {
  const composer = useNotificationComposer();
  const isGroup = mode === 'group';

  const payloadRows = Object.entries(composer.payload || {});

  function addPayloadField() {
    const key = prompt('Variable name (e.g. name, amount):');
    if (!key) return;
    composer.updatePayload({ [key]: '' });
  }

  return (
    <div className="space-y-4">
      <Card title={isGroup ? 'Audience' : 'Recipient'}>
        <AudienceSelector
          selected={composer.audience}
          onChange={composer.setAudience}
          multi={isGroup}
        />
      </Card>

      <Card title="Channels">
        <ChannelSelector
          selected={composer.channels}
          onChange={composer.setChannels}
        />
      </Card>

      <Card title="Template">
        <TemplateSelector
          value={composer.templateId}
          onChange={composer.setTemplateId}
        />
      </Card>

      <Card
        title="Variables"
        subtitle="Values injected into the template at send time"
        actions={
          <button onClick={addPayloadField} className="btn-secondary text-xs">
            + Variable
          </button>
        }
      >
        {payloadRows.length === 0 && (
          <div className="text-sm text-slate-400">
            No variables — click <strong>+ Variable</strong> to add one.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {payloadRows.map(([k, v]) => (
            <div key={k}>
              <label className="label">{k}</label>
              <input
                value={v ?? ''}
                onChange={(e) => composer.updatePayload({ [k]: e.target.value })}
                className="input"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
