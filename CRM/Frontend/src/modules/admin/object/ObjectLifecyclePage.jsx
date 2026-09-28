import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Archive, ArchiveRestore, ArrowRight, Copy, Send, Workflow } from 'lucide-react';
import useObject from '../../../core/hooks/useObject.js';
import objectsApi from '../../../core/api/objects.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import { OBJECT_LIFECYCLE, OBJECT_STATUS } from '../../../shared/enums/object-status.enum.js';
import { resolveIcon } from '../../../core/utils/icons.js';
import { formatDateTime } from '../../../core/utils/formatters.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import StatusPill from '../../../core/components/ui/StatusPill.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import ConfirmDialog from '../../../core/components/ui/ConfirmDialog.jsx';
import CloneObjectDialog from '../components/CloneObjectDialog.jsx';
import cx from '../../../core/utils/cx.js';

const ORDER = [OBJECT_STATUS.DRAFT, OBJECT_STATUS.PUBLISHED, OBJECT_STATUS.ARCHIVED];

/** Admin screen 5 — Object lifecycle stepper with Publish / Archive / Restore / Clone. */
export function ObjectLifecyclePage() {
  const { oid } = useParams();
  const toast = useToast();
  const { invalidate } = useMetadata();
  const { object, loading, error, refresh } = useObject(oid);
  const [confirm, setConfirm] = useState(null);
  const [cloning, setCloning] = useState(false);
  const [busy, setBusy] = useState(false);

  const act = async (label, task) => {
    setBusy(true);
    try {
      await task();
      await invalidate(oid);
      await refresh();
      toast.success(label);
    } catch (err) {
      toast.fromError(err, 'Action failed');
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  };

  if (loading && !object) {
    return (
      <Card className="p-6">
        <SkeletonText lines={6} />
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <ErrorState error={error} onRetry={refresh} />
      </Card>
    );
  }
  if (!object) return null;

  const currentIndex = ORDER.indexOf(object.status);

  return (
    <>
      <PageHeader
        title={`Object Lifecycle: ${object.label}`}
        subtitle="Draft → Published → Archived"
        icon={Workflow}
        back={`/admin/objects/${oid}`}
        breadcrumbs={[
          { label: 'Objects', to: '/admin/objects' },
          { label: object.label, to: `/admin/objects/${oid}` },
          { label: 'Lifecycle' },
        ]}
      />

      <Card className="p-6">
        <div className="flex flex-col items-center gap-6 py-4 sm:flex-row sm:justify-center">
          {OBJECT_LIFECYCLE.map((stage, index) => {
            const Icon = resolveIcon(stage.icon);
            const active = index === currentIndex;
            const done = index < currentIndex;
            return (
              <div key={stage.status} className="flex items-center gap-6">
                <div className="flex w-40 flex-col items-center text-center">
                  <span
                    className={cx(
                      'flex h-16 w-16 items-center justify-center rounded-full transition',
                      active
                        ? 'bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50'
                        : done
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-slate-50 text-slate-300',
                    )}
                  >
                    <Icon size={26} />
                  </span>
                  <p
                    className={cx(
                      'mt-3 text-sm font-bold',
                      active ? 'text-slate-900' : 'text-slate-500',
                    )}
                  >
                    {stage.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{stage.description}</p>
                </div>
                {index < OBJECT_LIFECYCLE.length - 1 && (
                  <ArrowRight size={20} className="hidden shrink-0 text-slate-300 sm:block" />
                )}
              </div>
            );
          })}
        </div>

        <dl className="mt-6 grid gap-4 rounded-xl border border-slate-200 p-4 sm:grid-cols-3">
          <div>
            <dt className="text-[11px] font-medium text-slate-500">Current Status</dt>
            <dd className="mt-1">
              <StatusPill kind="object" status={object.status} />
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium text-slate-500">Last Updated</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-800">
              {formatDateTime(object.updatedAt)}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium text-slate-500">Updated By</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-800">{object.updatedBy || '—'}</dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap gap-2">
          {object.status === OBJECT_STATUS.DRAFT && (
            <Button
              icon={Send}
              loading={busy}
              onClick={() => act('Object published', () => objectsApi.publish(oid))}
            >
              Publish Object
            </Button>
          )}
          {object.status === OBJECT_STATUS.PUBLISHED && (
            <Button variant="warning-outline" icon={Archive} onClick={() => setConfirm('archive')}>
              Archive Object
            </Button>
          )}
          {object.status === OBJECT_STATUS.ARCHIVED && (
            <Button
              variant="accent-outline"
              icon={ArchiveRestore}
              loading={busy}
              onClick={() => act('Object restored', () => objectsApi.restore(oid))}
            >
              Restore Object
            </Button>
          )}
          <Button variant="accent-outline" icon={Copy} onClick={() => setCloning(true)}>
            Clone Object
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={confirm === 'archive'}
        onClose={() => setConfirm(null)}
        title={`Archive ${object.label}?`}
        description="The object stops appearing in business consoles."
        note="Existing records are kept. You can restore the object at any time."
        confirmLabel="Archive object"
        tone="warning"
        loading={busy}
        onConfirm={() => act('Object archived', () => objectsApi.archive(oid))}
      />

      <CloneObjectDialog
        object={cloning ? object : null}
        onClose={() => setCloning(false)}
        onCloned={async () => {
          setCloning(false);
          await invalidate();
          toast.success('Object cloned');
        }}
      />
    </>
  );
}

export default ObjectLifecyclePage;
