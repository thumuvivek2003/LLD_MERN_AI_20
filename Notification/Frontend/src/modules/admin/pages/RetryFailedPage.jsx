import { useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout.jsx';
import { Card } from '../../../shared/components/Card.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { NotificationTable } from '../components/NotificationTable.jsx';
import { useNotificationFilters } from '../hooks/useNotificationFilters.js';

export function RetryFailedPage() {
  const { notifications, setFilters, loading, error } = useNotificationFilters();

  // Pre-apply FAILED filter on mount.
  useEffect(() => {
    setFilters({ status: 'FAILED' });
  }, [setFilters]);

  return (
    <DashboardLayout
      title="Retry Failed"
      subtitle="Quick-action page for failed deliveries"
    >
      <Card>
        {loading && <Loader />}
        {!loading && error && (
          <EmptyState title="Couldn't load" description={error} icon="⚠️" />
        )}
        {!loading && !error && notifications.length === 0 && (
          <EmptyState
            title="All clear"
            description="No failed notifications waiting for retry."
            icon="✨"
          />
        )}
        {!loading && !error && notifications.length > 0 && (
          <NotificationTable notifications={notifications} />
        )}
      </Card>
    </DashboardLayout>
  );
}
