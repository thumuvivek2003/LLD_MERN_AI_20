import { DashboardLayout } from '../../../layouts/DashboardLayout.jsx';
import { Card } from '../../../shared/components/Card.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { QueueStatusCard } from '../components/QueueStatusCard.jsx';
import { RetryQueueTable } from '../components/RetryQueueTable.jsx';
import { WorkerHealthCard } from '../components/WorkerHealthCard.jsx';
import { useQueueMonitor } from '../hooks/useQueueMonitor.js';

export function QueueMonitorPage() {
  const { data, loading, error, reload } = useQueueMonitor('queue');

  return (
    <DashboardLayout
      title="Queue Monitor"
      subtitle="Snapshot of the in-memory job queue"
      actions={
        <button onClick={reload} className="btn-secondary text-sm">
          Refresh
        </button>
      }
    >
      {loading && <Loader />}
      {error && !loading && (
        <EmptyState title="Couldn't load queue" description={error} icon="⚠️" />
      )}
      {!loading && !error && data && (
        <>
          <QueueStatusCard queue={data} />
          {data.workers !== undefined && Array.isArray(data.workerList) && (
            <Card title="Workers">
              <WorkerHealthCard workers={data.workerList} />
            </Card>
          )}
          <Card title="Pending Jobs">
            <RetryQueueTable jobs={data.jobs || []} />
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}
