import { useState } from 'react';
import { RefreshCw, Zap } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import systemApi from '../../../core/api/system.api.js';
import { EVENT_TYPE_LIST } from '../../../shared/enums/event-type.enum.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { KpiGrid, KpiTile } from '../../../core/components/layout/KpiTile.jsx';
import { formatCompact } from '../../../core/utils/formatters.js';
import EventStream from '../components/EventStream.jsx';

/** System → Event Monitor. The in-process event bus stream (Observer pattern, backend side). */
export function EventMonitorPage() {
  const [type, setType] = useState('');
  const [limit, setLimit] = useState(50);

  const events = useAsync(
    () => systemApi.events({ limit, ...(type ? { type } : {}) }),
    [type, limit],
    { initialData: [] },
  );
  const health = useAsync(() => systemApi.health(), []);
  const metrics = useAsync(() => systemApi.metrics(), []);

  const list = Array.isArray(events.data) ? events.data : [];

  return (
    <>
      <PageHeader
        title="Event Monitor"
        subtitle="Real-time system events published on the internal bus"
        icon={Zap}
        actions={
          <Button variant="secondary" icon={RefreshCw} onClick={events.reload}>
            Refresh
          </Button>
        }
      />

      <KpiGrid columns={4} className="mb-5">
        <KpiTile label="Events / min" value={formatCompact(metrics.data?.eventsPerMin)} icon={Zap} tone="indigo" loading={metrics.loading} />
        <KpiTile label="Bus Status" value={health.data?.eventBus?.status ?? '—'} icon={Zap} tone="emerald" loading={health.loading} />
        <KpiTile label="Queued" value={health.data?.eventBus?.queued ?? 0} icon={Zap} tone="amber" loading={health.loading} />
        <KpiTile label="Partitions" value={health.data?.eventBus?.partitions ?? 0} icon={Zap} tone="sky" loading={health.loading} />
      </KpiGrid>

      <Card>
        <CardHeader
          title="Event Stream"
          subtitle={`${list.length} most recent events`}
          icon={Zap}
          actions={
            <>
              <Select
                size="sm"
                className="w-56"
                value={type}
                placeholder="All event types"
                onChange={(event) => setType(event.target.value)}
                options={EVENT_TYPE_LIST.map((value) => ({ value, label: value }))}
              />
              <Select
                size="sm"
                className="w-28"
                value={limit}
                onChange={(event) => setLimit(Number(event.target.value))}
                options={[25, 50, 100, 200].map((value) => ({ value, label: `Last ${value}` }))}
              />
            </>
          }
        />
        <EventStream
          events={list}
          loading={events.loading}
          error={events.error}
          onRetry={events.reload}
        />
      </Card>
    </>
  );
}

export default EventMonitorPage;
