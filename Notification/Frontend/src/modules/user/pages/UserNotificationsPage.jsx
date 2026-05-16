// User-facing detailed list + channel preview gallery.
import { useState } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout.jsx';
import { Card } from '../../../shared/components/Card.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { NotificationCard } from '../components/NotificationCard.jsx';
import { NotificationPreviewCard } from '../components/NotificationPreviewCard.jsx';
import { useNotifications } from '../hooks/useNotifications.js';
import { CHANNELS } from '../../../shared/constants/notification.constants.js';

export function UserNotificationsPage() {
  const { notifications, loading, error } = useNotifications();
  const [previewChannel, setPreviewChannel] = useState('EMAIL');

  const sample = notifications.find((n) => n.channel === previewChannel) ||
    notifications[0] || {
      renderedPreview: {
        subject: 'Payment Successful',
        body: 'Hi Vivek, your payment of ₹500 was successful.',
      },
    };

  return (
    <DashboardLayout
      title="Notifications"
      subtitle="Browse history and see how each channel renders"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {loading && <Loader />}
          {error && (
            <EmptyState title="Failed to load" description={error} icon="⚠️" />
          )}
          {!loading && !error && notifications.length === 0 && (
            <EmptyState title="No notifications yet" />
          )}
          {notifications.map((n) => (
            <NotificationCard key={n.id} notification={n} />
          ))}
        </div>
        <div className="space-y-4">
          <Card
            title="Channel Preview"
            subtitle="Sample render for each channel"
          >
            <div className="flex items-center gap-2 mb-4">
              {CHANNELS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setPreviewChannel(c.key)}
                  className={`px-2.5 py-1 text-xs rounded-lg border ${
                    previewChannel === c.key
                      ? 'bg-brand-50 border-brand-200 text-brand-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <NotificationPreviewCard
              channel={previewChannel}
              subject={sample.renderedPreview?.subject || 'Sample subject'}
              body={
                sample.renderedPreview?.body || 'Sample body for this channel.'
              }
            />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
