import { DashboardLayout } from '../../../layouts/DashboardLayout.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { Card } from '../../../shared/components/Card.jsx';
import { DashboardStatsCard } from '../components/DashboardStatsCard.jsx';
import { NotificationTable } from '../components/NotificationTable.jsx';
import { useAdminDashboard } from '../hooks/useAdminDashboard.js';

export function AdminDashboardPage() {
  const { metrics, loading, error } = useAdminDashboard();
  const totals = metrics?.totals || {};
  const recent = metrics?.recentFailures || [];

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="Live picture of the notification pipeline"
    >
      {loading && <Loader />}
      {error && !loading && (
        <EmptyState
          title="Couldn't load dashboard"
          description={error}
          icon="⚠️"
        />
      )}
      {!loading && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardStatsCard
              label="Sent"
              value={totals.sent}
              accent="success"
              icon="✓"
            />
            <DashboardStatsCard
              label="Failed"
              value={totals.failed}
              accent="danger"
              icon="✕"
            />
            <DashboardStatsCard
              label="Queued"
              value={totals.queued}
              accent="warn"
              icon="⧗"
            />
            <DashboardStatsCard
              label="Retrying"
              value={totals.retrying}
              accent="warn"
              icon="↻"
            />
          </div>
          <Card
            title="Recent Failures"
            subtitle="Last failed deliveries — retry from here"
          >
            <NotificationTable notifications={recent} />
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}
