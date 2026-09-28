import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Archive,
  ArchiveRestore,
  Copy,
  History,
  Info,
  Link2,
  Pencil,
  Share2,
} from 'lucide-react';
import useObject from '../../../core/hooks/useObject.js';
import useRecord, { useRecordHistory, useRelatedRecords } from '../../../core/hooks/useRecord.js';
import usePermission from '../../../core/hooks/usePermission.js';
import recordsApi from '../../../core/api/records.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { RECORD_STATUS } from '../../../shared/enums/record-status.enum.js';
import { recordTitle } from '../../../shared/mapper/record.mapper.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import { Tabs } from '../../../core/components/ui/Tabs.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import Menu from '../../../core/components/ui/Menu.jsx';
import Avatar from '../../../core/components/ui/Avatar.jsx';
import StatusPill from '../../../core/components/ui/StatusPill.jsx';
import ConfirmDialog from '../../../core/components/ui/ConfirmDialog.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import RecordOverview from '../../../core/components/record/RecordOverview.jsx';
import RelatedRecordsPanel from '../../../core/components/record/RelatedRecordsPanel.jsx';
import RecordHistoryPanel from '../../../core/components/record/RecordHistoryPanel.jsx';
import RecordActionsRail from './components/RecordActionsRail.jsx';

/** Business screen 4 — record detail with Overview · Related · History, Actions rail and Quick Links. */
export function RecordViewPage() {
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
  const related = useRelatedRecords(oid, rid);
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

  const clone = async () => {
    setBusy(true);
    try {
      const created = await recordsApi.create(oid, record.recordJson);
      toast.success('Record cloned', created?.displayName);
      navigate(`/business/objects/${oid}/records/${created.recordId}`);
    } catch (err) {
      toast.fromError(err, 'Could not clone record');
      setBusy(false);
    }
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied', 'Share this record with a teammate');
    } catch {
      toast.warning('Could not copy', 'Copy the address bar URL manually');
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
  const isActive = record.status === RECORD_STATUS.ACTIVE;
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'related', label: 'Related Records', icon: Link2, count: related.related.length || undefined },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <>
      <PageHeader
        title={`${object?.label ?? 'Record'} Details`}
        back={`/business/objects/${oid}/records`}
        breadcrumbs={[
          { label: 'My Objects', to: '/business/objects' },
          { label: object?.label ?? oid, to: `/business/objects/${oid}/records` },
          { label: title },
        ]}
        actions={
          <>
            {permission.canUpdate && (
              <Button
                as={Link}
                to={`/business/objects/${oid}/records/${rid}/edit`}
                variant="secondary"
                icon={Pencil}
              >
                Edit
              </Button>
            )}
            <Menu
              buttonLabel="More actions"
              items={[
                { id: 'clone', label: 'Clone Record', icon: Copy, disabled: !permission.canCreate, onSelect: clone },
                { id: 'share', label: 'Share Record', icon: Share2, onSelect: share },
                isActive
                  ? {
                      id: 'archive',
                      label: 'Archive Record',
                      icon: Archive,
                      tone: 'danger',
                      disabled: !permission.canDelete,
                      onSelect: () => setConfirm('archive'),
                    }
                  : {
                      id: 'restore',
                      label: 'Restore Record',
                      icon: ArchiveRestore,
                      disabled: !permission.canUpdate,
                      onSelect: () => act('Record restored', restore),
                    },
              ]}
              trigger={<Button variant="secondary">More</Button>}
            />
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_260px]">
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
            <Tabs tabs={tabs} active={tab} onChange={(next) => setParams({ tab: next })} />
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
                recordLinkTo={(objectId, recordId) =>
                  `/business/objects/${objectId}/records/${recordId}`
                }
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

        <RecordActionsRail
          objectId={oid}
          recordId={rid}
          isActive={isActive}
          permission={permission}
          related={related.related}
          onClone={clone}
          onShare={share}
          onArchive={() => setConfirm('archive')}
          onRestore={() => act('Record restored', restore)}
          busy={busy}
        />
      </div>

      <ConfirmDialog
        open={confirm === 'archive'}
        onClose={() => setConfirm(null)}
        title="Archive Record"
        description="This record will be archived and hidden from active views."
        note="You can restore this record anytime from the archive."
        confirmLabel="Archive Record"
        loading={busy}
        onConfirm={() =>
          act('Record archived', async () => {
            await archive();
            navigate(`/business/objects/${oid}/records`);
          })
        }
      >
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
          <Avatar name={title} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">{title}</p>
            <p className="truncate font-mono text-[11px] text-slate-400">{record.recordId}</p>
          </div>
        </div>
      </ConfirmDialog>
    </>
  );
}

export default RecordViewPage;
