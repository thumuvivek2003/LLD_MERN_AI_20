import { DashboardLayout } from '../../../layouts/DashboardLayout.jsx';
import { Card } from '../../../shared/components/Card.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { NotificationFilterBar } from '../components/NotificationFilterBar.jsx';
import { NotificationTable } from '../components/NotificationTable.jsx';
import { useNotificationFilters } from '../hooks/useNotificationFilters.js';

export function NotificationManagementPage() {
  const {
    notifications,
    filters,
    setFilters,
    resetFilters,
    loading,
    error,
  } = useNotificationFilters();

  return (
    <DashboardLayout
      title="All Notifications"
      subtitle="Filter, inspect and retry from a single view"
    >
      <NotificationFilterBar
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
      />
      <Card>
        {loading && <Loader />}
        {!loading && error && (
          <EmptyState
            title="Couldn't fetch notifications"
            description={error}
            icon="⚠️"
          />
        )}
        {!loading && !error && (
          <NotificationTable notifications={notifications} />
        )}
      </Card>
    </DashboardLayout>
  );
}
