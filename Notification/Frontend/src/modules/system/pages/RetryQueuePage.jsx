import { DashboardLayout } from '../../../layouts/DashboardLayout.jsx';
import { Card } from '../../../shared/components/Card.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { RetryQueueTable } from '../components/RetryQueueTable.jsx';
import { useQueueMonitor } from '../hooks/useQueueMonitor.js';

export function RetryQueuePage() {
  const { data, loading, error, reload } = useQueueMonitor('retry');
  const jobs = Array.isArray(data) ? data : data?.jobs || data?.items || [];

  return (
    <DashboardLayout
      title="Retry Queue"
      subtitle="Pending retry jobs with backoff schedule"
      actions={
        <button onClick={reload} className="btn-secondary text-sm">
          Refresh
        </button>
      }
    >
      {loading && <Loader />}
      {error && !loading && (
        <EmptyState title="Couldn't load retry queue" description={error} icon="⚠️" />
      )}
      {!loading && !error && (
        <Card>
          <RetryQueueTable jobs={jobs} />
        </Card>
      )}
    </DashboardLayout>
  );
}
