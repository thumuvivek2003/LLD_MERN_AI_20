import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Archive, ArchiveRestore, History, Info, Link2 } from 'lucide-react';
import useObject from '../../../core/hooks/useObject.js';
import useRecord, { useRecordHistory, useRelatedRecords } from '../../../core/hooks/useRecord.js';
import usePermission from '../../../core/hooks/usePermission.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { RECORD_STATUS } from '../../../shared/enums/record-status.enum.js';
import { recordTitle } from '../../../shared/mapper/record.mapper.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import { Tabs } from '../../../core/components/ui/Tabs.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import Avatar from '../../../core/components/ui/Avatar.jsx';
import StatusPill from '../../../core/components/ui/StatusPill.jsx';
import ConfirmDialog from '../../../core/components/ui/ConfirmDialog.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import RecordOverview from '../../../core/components/record/RecordOverview.jsx';
import RelatedRecordsPanel from '../../../core/components/record/RelatedRecordsPanel.jsx';
import RecordHistoryPanel from '../../../core/components/record/RecordHistoryPanel.jsx';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Info },
  { id: 'related', label: 'Related', icon: Link2 },
  { id: 'history', label: 'History', icon: History },
];

/** Admin screen 15 — View record (Overview · Related · History). */
export function AdminRecordViewPage() {
  const { oid, rid } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'overview';
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);

  const permission = usePermission(oid);
  const { object, fields } = useObject(oid);
  const { record, resolved, loading, error, reload, archive, restore } = useRecord(oid, rid);
  const related = useRelatedRecords(oid, rid, { enabled: tab === 'related' });
  const history = useRecordHistory(oid, rid, { enabled: tab === 'history' });

  const visible = useMemo(() => permission.visibleFields(fields), [fields, permission]);

  const act = async (label, task) => {
    setBusy(true);
    try {
      await task();
      toast.success(label);
    } catch (err) {
      toast.fromError(err, 'Action failed');
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  };

  if (loading && !record) {
    return (
      <Card className="p-6">
        <SkeletonText lines={8} />
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <ErrorState error={error} onRetry={reload} />
      </Card>
    );
  }
  if (!record) return null;

  const title = recordTitle(object, record);

  return (
    <>
      <PageHeader
        title={`${object?.label ?? 'Record'} Details`}
        back={`/admin/records/${oid}`}
        breadcrumbs={[
          { label: 'Records', to: '/admin/records' },
          { label: object?.label ?? oid, to: `/admin/records/${oid}` },
          { label: title },
        ]}
        actions={
          record.status === RECORD_STATUS.ACTIVE ? (
            <Button
              variant="danger-outline"
              icon={Archive}
              disabled={!permission.canDelete}
              onClick={() => setConfirm('archive')}
            >
              Archive Record
            </Button>
          ) : (
            <Button
              variant="accent-outline"
              icon={ArchiveRestore}
              loading={busy}
              disabled={!permission.canUpdate}
              onClick={() => act('Record restored', restore)}
            >
              Restore Record
            </Button>
          )
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-5">
          <Avatar name={title} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-bold text-slate-900">{title}</h2>
              <StatusPill kind="record" status={record.status} />
            </div>
            <p className="mt-0.5 font-mono text-xs text-slate-400">{record.recordId}</p>
          </div>
        </div>

        <div className="px-5 pt-4">
          <Tabs tabs={TABS} active={tab} onChange={(next) => setParams({ tab: next })} />
        </div>

        <div className="p-5">
          {tab === 'overview' && (
            <RecordOverview fields={visible} record={record} resolved={resolved} />
          )}
          {tab === 'related' && (
            <RelatedRecordsPanel
              groups={related.related}
              loading={related.loading}
              error={related.error}
              onRetry={related.reload}
              recordLinkTo={(objectId, recordId) => `/admin/records/${objectId}/${recordId}`}
            />
          )}
          {tab === 'history' && (
            <div className="-mx-5 -mb-5">
              <RecordHistoryPanel
                entries={history.history}
                loading={history.loading}
                error={history.error}
                onRetry={history.reload}
              />
            </div>
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={confirm === 'archive'}
        onClose={() => setConfirm(null)}
        title="Archive this record?"
        description="It will be hidden from active views but can be restored at any time."
        confirmLabel="Archive Record"
        loading={busy}
        onConfirm={() =>
          act('Record archived', async () => {
            await archive();
            navigate(`/admin/records/${oid}`);
          })
        }
      />
    </>
  );
}

export default AdminRecordViewPage;
