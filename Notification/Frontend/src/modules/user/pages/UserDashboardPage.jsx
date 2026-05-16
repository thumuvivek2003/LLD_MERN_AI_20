import { useMemo, useState } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { NotificationCard } from '../components/NotificationCard.jsx';
import { NotificationChannelTabs } from '../components/NotificationChannelTabs.jsx';
import { useNotifications } from '../hooks/useNotifications.js';

export function UserDashboardPage() {
  const { notifications, loading, error } = useNotifications();
  const [channel, setChannel] = useState(null);

  const filtered = useMemo(
    () =>
      channel
        ? notifications.filter((n) => n.channel === channel)
        : notifications,
    [notifications, channel],
  );

  return (
    <DashboardLayout
      title="My Notifications"
      subtitle="Everything we've sent your way recently"
      actions={
        <NotificationChannelTabs active={channel} onChange={setChannel} />
      }
    >
      {loading && <Loader />}
      {error && !loading && (
        <EmptyState
          title="Couldn't load notifications"
          description={error}
          icon="⚠️"
        />
      )}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          title="Inbox zero"
          description="When events trigger notifications for you, they'll show up here."
        />
      )}
      <div className="grid gap-3">
        {filtered.map((n) => (
          <NotificationCard key={n.id} notification={n} />
        ))}
      </div>
    </DashboardLayout>
  );
}
