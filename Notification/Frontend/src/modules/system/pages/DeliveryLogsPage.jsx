import { DashboardLayout } from '../../../layouts/DashboardLayout.jsx';
import { Card } from '../../../shared/components/Card.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { DeliveryLogTable } from '../components/DeliveryLogTable.jsx';
import { useQueueMonitor } from '../hooks/useQueueMonitor.js';

export function DeliveryLogsPage() {
  const { data, loading, error, reload } = useQueueMonitor('logs');
  const logs = Array.isArray(data) ? data : data?.items || data?.logs || [];

  return (
    <DashboardLayout
      title="Delivery Logs"
      subtitle="Recent delivery attempts across all channels"
      actions={
        <button onClick={reload} className="btn-secondary text-sm">
          Refresh
        </button>
      }
    >
      {loading && <Loader />}
      {error && !loading && (
        <EmptyState title="Couldn't load logs" description={error} icon="⚠️" />
      )}
      {!loading && !error && (
        <Card>
          <DeliveryLogTable logs={logs} />
        </Card>
      )}
    </DashboardLayout>
  );
}
