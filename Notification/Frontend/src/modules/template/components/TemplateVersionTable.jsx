import { Table } from '../../../shared/components/Table.jsx';
import { formatDate } from '../../../shared/utils/formatDate.js';

export function TemplateVersionTable({ versions = [] }) {
  const columns = [
    {
      key: 'version',
      header: 'Version',
      render: (v) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">v{v.version}</span>
          {v.isActive && (
            <span className="pill bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
              active
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (v) => (
        <span className="text-sm text-slate-700">{v.subjectTemplate}</span>
      ),
    },
    {
      key: 'body',
      header: 'Body (preview)',
      render: (v) => (
        <span className="text-xs text-slate-500 line-clamp-2">
          {v.bodyTemplate}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (v) => (
        <span className="text-xs text-slate-500">{formatDate(v.createdAt)}</span>
      ),
    },
  ];
  return (
    <Table columns={columns} rows={versions} emptyText="No versions yet." />
  );
}
