import { Link } from 'react-router-dom';
import { Database } from 'lucide-react';
import { INDEX_TYPE_LABEL } from '../../../shared/enums/index-type.enum.js';
import DataTable from '../../../core/components/table/DataTable.jsx';
import StatusPill from '../../../core/components/ui/StatusPill.jsx';
import { DOTS } from '../../../core/components/ui/Badge.jsx';
import { formatCompact, formatTime } from '../../../core/utils/formatters.js';
import cx from '../../../core/utils/cx.js';

/** Index table used by the System dashboard panel and the Index Management page. */
export function IndexSummaryTable({ indexes = [], loading, error, onRetry, dense = true }) {
  const columns = [
    {
      key: 'name',
      header: 'Index Name',
      className: 'font-semibold text-slate-800',
      render: (index) => (
        <Link to={`/admin/indexes/${index.indexId}`} className="font-mono text-xs hover:text-accent">
          {index.name || index.fieldLabel}
        </Link>
      ),
    },
    { key: 'objectLabel', header: 'Object', render: (index) => index.objectLabel || index.objectId },
    { key: 'type', header: 'Type', render: (index) => INDEX_TYPE_LABEL[index.type] || index.type },
    { key: 'status', header: 'Status', render: (index) => <StatusPill kind="index" status={index.status} /> },
    { key: 'docCount', header: 'Docs', render: (index) => formatCompact(index.docCount) },
    {
      key: 'lastBuiltAt',
      header: 'Last Updated',
      render: (index) => <span className="text-xs text-slate-500">{formatTime(index.lastBuiltAt)}</span>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={indexes}
      rowKey={(index) => index.indexId}
      loading={loading}
      error={error}
      onRetry={onRetry}
      dense={dense}
      emptyIcon={Database}
      emptyTitle="No indexes"
      emptyDescription="Mark a field as searchable to build one."
    />
  );
}

/** The Healthy / Rebuilding / Failed / Inactive counter strip under the index table. */
export function IndexStatusCounters({ summary }) {
  const rows = [
    { label: 'Healthy', value: summary?.healthy ?? 0, tone: 'emerald' },
    { label: 'Rebuilding', value: summary?.building ?? 0, tone: 'amber' },
    { label: 'Failed', value: summary?.failed ?? 0, tone: 'rose' },
    { label: 'Inactive', value: summary?.inactive ?? 0, tone: 'slate' },
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-100 px-5 py-3">
      {rows.map((row) => (
        <span key={row.label} className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className={cx('h-1.5 w-1.5 rounded-full', DOTS[row.tone])} />
          {row.label}
          <span className="font-bold text-slate-800">{row.value}</span>
        </span>
      ))}
    </div>
  );
}

export default IndexSummaryTable;
