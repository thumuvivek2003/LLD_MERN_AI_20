import { useState } from 'react';
import { RefreshCw, ScrollText } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import systemApi from '../../../core/api/system.api.js';
import { LOG_LEVEL_LIST, LOG_LEVEL_TONE } from '../../../shared/enums/log-level.enum.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import Badge from '../../../core/components/ui/Badge.jsx';
import { formatDateTime } from '../../../core/utils/formatters.js';
import LogLevelDonuts from '../components/LogLevelDonuts.jsx';

/** System → System Logs. Level counters plus the raw log stream. */
export function SystemLogsPage() {
  const [level, setLevel] = useState('');
  const [limit, setLimit] = useState(100);

  const logs = useAsync(
    () => systemApi.logs({ limit, ...(level ? { level } : {}) }),
    [level, limit],
    { initialData: [] },
  );
  const summary = useAsync(() => systemApi.logsSummary(), []);

  const columns = [
    {
      key: 'at',
      header: 'Time',
      className: 'whitespace-nowrap font-semibold text-slate-800',
      render: (log) => formatDateTime(log.at),
    },
    {
      key: 'level',
      header: 'Level',
      render: (log) => <Badge tone={LOG_LEVEL_TONE[log.level] || 'slate'}>{log.level}</Badge>,
    },
    {
      key: 'source',
      header: 'Source',
      render: (log) => <span className="font-mono text-xs text-slate-500">{log.source}</span>,
    },
    { key: 'message', header: 'Message', render: (log) => <span className="text-slate-600">{log.message}</span> },
  ];

  return (
    <>
      <PageHeader
        title="System Logs"
        subtitle="Structured application logs from the engine"
        icon={ScrollText}
        actions={
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={() => {
              logs.reload();
              summary.reload();
            }}
          >
            Refresh
          </Button>
        }
      />

      <Card className="mb-5">
        <CardHeader title="Log levels" subtitle="Counts in the retained window" icon={ScrollText} />
        <div className="p-5">
          <LogLevelDonuts summary={summary.data} loading={summary.loading} />
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Log Stream"
          subtitle={`${Array.isArray(logs.data) ? logs.data.length : 0} entries`}
          icon={ScrollText}
          actions={
            <>
              <Select
                size="sm"
                className="w-36"
                value={level}
                placeholder="All levels"
                onChange={(event) => setLevel(event.target.value)}
                options={LOG_LEVEL_LIST.map((value) => ({ value, label: value }))}
              />
              <Select
                size="sm"
                className="w-28"
                value={limit}
                onChange={(event) => setLimit(Number(event.target.value))}
                options={[50, 100, 200].map((value) => ({ value, label: `Last ${value}` }))}
              />
            </>
          }
        />
        <DataTable
          columns={columns}
          rows={Array.isArray(logs.data) ? logs.data : []}
          rowKey={(log, index) => log.logId ?? index}
          loading={logs.loading}
          error={logs.error}
          onRetry={logs.reload}
          dense
          emptyIcon={ScrollText}
          emptyTitle="No log entries"
          emptyDescription="Nothing has been logged at this level yet."
        />
      </Card>
    </>
  );
}

export default SystemLogsPage;
