import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout.jsx';
import { Card } from '../../../shared/components/Card.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { StatusPill } from '../../../shared/components/StatusPill.jsx';
import { RetryTimeline } from '../components/RetryTimeline.jsx';
import { RetryNotificationButton } from '../components/RetryNotificationButton.jsx';
import { NotificationPreviewCard } from '../../user/components/NotificationPreviewCard.jsx';
import { fetchNotificationById } from '../services/adminNotification.service.js';
import { formatDate } from '../../../shared/utils/formatDate.js';

export function NotificationDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchNotificationById(id)
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, refreshKey]);

  if (loading) return <Loader />;
  if (error)
    return (
      <EmptyState title="Couldn't load" description={error} icon="⚠️" />
    );
  if (!data) return null;

  const preview = data.renderedPreview || { subject: '', body: '' };

  return (
    <DashboardLayout
      title="Notification Details"
      subtitle={`ID ${data.id}`}
      actions={
        <>
          <Link to="/admin/notifications" className="btn-ghost text-xs">
            ← Back
          </Link>
          <RetryNotificationButton
            notificationId={data.id}
            status={data.status}
            onRetried={() => setRefreshKey((k) => k + 1)}
          />
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card
            title="Summary"
            actions={<StatusPill status={data.status} />}
          >
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-slate-500">Channel</dt>
              <dd className="text-slate-800 font-medium">{data.channel}</dd>
              <dt className="text-slate-500">Event Type</dt>
              <dd className="text-slate-800 font-medium">{data.eventType}</dd>
              <dt className="text-slate-500">User</dt>
              <dd className="text-slate-800 font-medium">
                {data.user?.name || data.userId}
              </dd>
              <dt className="text-slate-500">Template</dt>
              <dd className="text-slate-800 font-medium">
                {data.templateId
                  ? `${data.templateId} · v${data.templateVersion}`
                  : 'Custom content'}
              </dd>
              <dt className="text-slate-500">Retries</dt>
              <dd className="text-slate-800 font-medium">
                {data.retryCount ?? 0}
              </dd>
              <dt className="text-slate-500">Created</dt>
              <dd className="text-slate-800 font-medium">
                {formatDate(data.createdAt)}
              </dd>
            </dl>
          </Card>

          <Card title="Retry Timeline">
            <RetryTimeline attempts={data.attempts} />
          </Card>

          <Card title="Payload Snapshot">
            <pre className="text-xs bg-slate-50 rounded-xl p-3 overflow-x-auto border border-slate-100">
              {JSON.stringify(data.payloadSnapshot || {}, null, 2)}
            </pre>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Rendered Preview">
            <NotificationPreviewCard
              channel={data.channel}
              subject={preview.subject}
              body={preview.body}
            />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
