import { Link } from 'react-router-dom';
import { Archive, ArchiveRestore, ArrowUpRight, Copy, Send, Workflow } from 'lucide-react';
import { OBJECT_STATUS } from '../../../../shared/enums/object-status.enum.js';
import { formatDateTime, formatNumber } from '../../../../core/utils/formatters.js';
import Button from '../../../../core/components/ui/Button.jsx';
import StatusPill from '../../../../core/components/ui/StatusPill.jsx';

const Stat = ({ label, value }) => (
  <div className="rounded-lg bg-slate-50 px-3.5 py-3">
    <p className="text-[11px] font-medium text-slate-500">{label}</p>
    <p className="mt-0.5 text-lg font-bold text-slate-900">{value}</p>
  </div>
);

/** Edit Object → Settings. Lifecycle actions live here (publish / archive / restore / clone). */
export function ObjectSettingsTab({ object, stats, busy, onPublish, onArchive, onRestore, onClone }) {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-sm font-semibold text-slate-900">Object statistics</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Total records" value={formatNumber(stats?.recordCount ?? object.recordCount)} />
          <Stat label="Active" value={formatNumber(stats?.activeCount)} />
          <Stat label="Archived" value={formatNumber(stats?.archivedCount)} />
          <Stat label="Indexes" value={formatNumber(stats?.indexCount)} />
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          Last activity {stats?.lastActivityAt ? formatDateTime(stats.lastActivityAt) : '—'}
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Lifecycle</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Current status <StatusPill kind="object" status={object.status} className="ml-1" />
            </p>
          </div>
          <Button
            as={Link}
            to={`/admin/objects/${object.objectId}/lifecycle`}
            variant="secondary"
            size="sm"
            iconRight={ArrowUpRight}
          >
            Open lifecycle view
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {object.status === OBJECT_STATUS.DRAFT && (
            <Button icon={Send} loading={busy} onClick={onPublish}>
              Publish Object
            </Button>
          )}
          {object.status === OBJECT_STATUS.PUBLISHED && (
            <Button variant="warning-outline" icon={Archive} loading={busy} onClick={onArchive}>
              Archive Object
            </Button>
          )}
          {object.status === OBJECT_STATUS.ARCHIVED && (
            <Button variant="accent-outline" icon={ArchiveRestore} loading={busy} onClick={onRestore}>
              Restore Object
            </Button>
          )}
          <Button variant="secondary" icon={Copy} onClick={onClone}>
            Clone Object
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Relationships</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Lookup fields on this object and the objects that point back at it.
        </p>
        <Button
          as={Link}
          to="/admin/relationships"
          variant="secondary"
          size="sm"
          icon={Workflow}
          className="mt-3"
        >
          View relationship graph
        </Button>
      </section>
    </div>
  );
}

export default ObjectSettingsTab;
