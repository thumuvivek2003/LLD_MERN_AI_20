import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout.jsx';
import { Card } from '../../../shared/components/Card.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { NotificationReviewCard } from '../components/NotificationReviewCard.jsx';
import { DeliveryChannelCard } from '../components/DeliveryChannelCard.jsx';
import { useNotificationComposer } from '../hooks/useNotificationComposer.js';
import { useSendNotification } from '../hooks/useSendNotification.js';
import { useTemplates } from '../../template/hooks/useTemplates.js';
import { renderTemplate } from '../../../shared/utils/renderTemplate.js';

export function NotificationReviewPage() {
  const navigate = useNavigate();
  const composer = useNotificationComposer();
  const { send, sendGroup, submitting, error } = useSendNotification();
  const { templates } = useTemplates();
  const [done, setDone] = useState(null);

  const templateMeta = useMemo(
    () => templates.find((t) => t.id === composer.templateId),
    [templates, composer.templateId],
  );

  const activeVersion = useMemo(() => {
    if (!templateMeta) return null;
    return (
      templateMeta.versions?.find((v) => v.isActive) ||
      templateMeta.versions?.[templateMeta.versions.length - 1]
    );
  }, [templateMeta]);

  useEffect(() => {
    if (composer.audience.length === 0 || composer.channels.length === 0) {
      // Redirect back if state was wiped.
      navigate('/compose/send');
    }
  }, [composer.audience.length, composer.channels.length, navigate]);

  async function handleSend() {
    try {
      if (composer.mode === 'group') {
        const res = await sendGroup({
          userIds: composer.audience,
          templateId: composer.templateId,
          channels: composer.channels,
          payload: composer.payload,
        });
        setDone(res);
      } else {
        const res = await send({
          userId: composer.audience[0],
          templateId: composer.templateId,
          channels: composer.channels,
          payload: composer.payload,
        });
        setDone(res);
      }
    } catch {
      /* error surfaced via hook */
    }
  }

  if (done) {
    return (
      <DashboardLayout
        title="Notification queued"
        subtitle="Workers will deliver shortly"
      >
        <EmptyState
          title="Successfully queued"
          description="Your notification has been handed off to the queue. Check the dashboard to follow its lifecycle."
          icon="✅"
          action={
            <Link to="/admin/notifications" className="btn-primary text-sm">
              Open dashboard
            </Link>
          }
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Review & Send"
      subtitle="Last chance — verify everything before queueing"
      actions={
        <>
          <Link
            to={composer.mode === 'group' ? '/compose/group' : '/compose/send'}
            className="btn-ghost text-sm"
          >
            ← Edit
          </Link>
          <button
            disabled={submitting}
            onClick={handleSend}
            className="btn-primary text-sm"
          >
            {submitting ? 'Sending…' : 'Send Now'}
          </button>
        </>
      }
    >
      {error && (
        <div className="card p-3 text-sm text-red-700 bg-red-50 border-red-100">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NotificationReviewCard composer={composer} templateMeta={templateMeta} />
        <Card title="Channel Previews">
          {!activeVersion && (
            <div className="text-sm text-slate-400">
              Pick a template to see previews.
            </div>
          )}
          {activeVersion && (
            <div className="space-y-4">
              {composer.channels.map((ch) => (
                <DeliveryChannelCard
                  key={ch}
                  channel={ch}
                  subject={renderTemplate(
                    activeVersion.subjectTemplate,
                    composer.payload,
                  )}
                  body={renderTemplate(
                    activeVersion.bodyTemplate,
                    composer.payload,
                  )}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
