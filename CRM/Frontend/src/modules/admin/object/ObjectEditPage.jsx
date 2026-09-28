import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowUpDown,
  History,
  Info,
  ListTree,
  Plus,
  Settings,
  ShieldCheck,
  Table2,
} from 'lucide-react';
import useObject from '../../../core/hooks/useObject.js';
import useAsync from '../../../core/hooks/useAsync.js';
import objectsApi from '../../../core/api/objects.api.js';
import fieldsApi from '../../../core/api/fields.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import { Tabs } from '../../../core/components/ui/Tabs.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import StatusPill from '../../../core/components/ui/StatusPill.jsx';
import ConfirmDialog from '../../../core/components/ui/ConfirmDialog.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import { resolveIcon } from '../../../core/utils/icons.js';
import { formatNumber } from '../../../core/utils/formatters.js';
import FieldTable from '../components/FieldTable.jsx';
import CloneObjectDialog from '../components/CloneObjectDialog.jsx';
import ObjectDetailsTab from './tabs/ObjectDetailsTab.jsx';
import ObjectSettingsTab from './tabs/ObjectSettingsTab.jsx';
import ObjectPermissionsTab from './tabs/ObjectPermissionsTab.jsx';
import ObjectHistoryTab from './tabs/ObjectHistoryTab.jsx';

/** Admin screen 4 — Edit Object with Details · Fields · Settings · Permissions · History. */
export function ObjectEditPage() {
  const { oid } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { invalidate } = useMetadata();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'details';
  const [cloning, setCloning] = useState(false);
  const [deletingField, setDeletingField] = useState(null);
  const [busy, setBusy] = useState(false);

  const { object, fields, loading, error, refresh } = useObject(oid);
  const stats = useAsync(() => objectsApi.stats(oid), [oid]);

  const lifecycle = async (label, task) => {
    setBusy(true);
    try {
      await task();
      await invalidate(oid);
      await refresh();
      await stats.reload();
      toast.success(label);
    } catch (err) {
      toast.fromError(err, 'Action failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading && !object) {
    return (
      <Card className="p-6">
        <SkeletonText lines={8} />
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

  const Icon = resolveIcon(object.icon);
  const tabs = [
    { id: 'details', label: 'Details', icon: Info },
    { id: 'fields', label: 'Fields', icon: ListTree, count: fields.length },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'permissions', label: 'Permissions', icon: ShieldCheck },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <>
      <PageHeader
        title={`Edit Object: ${object.label}`}
        subtitle="Update object information and settings"
        icon={Icon}
        back="/admin/objects"
        breadcrumbs={[{ label: 'Objects', to: '/admin/objects' }, { label: object.label }]}
        meta={
          <>
            <StatusPill kind="object" status={object.status} />
            <span className="text-xs text-slate-400">
              {formatNumber(object.recordCount)} records · {fields.length} fields · v{object.version ?? 1}
            </span>
          </>
        }
        actions={
          <>
            <Button as={Link} to={`/admin/records/${oid}`} variant="secondary" icon={Table2}>
              Records
            </Button>
            <Button as={Link} to={`/admin/objects/${oid}/fields/new`} icon={Plus}>
              Add Field
            </Button>
          </>
        }
      />

      <Card>
        <div className="px-5 pt-4">
          <Tabs tabs={tabs} active={tab} onChange={(next) => setParams({ tab: next })} />
        </div>

        <div className="p-5">
          {tab === 'details' && <ObjectDetailsTab object={object} onSaved={refresh} />}

          {tab === 'fields' && (
            <div className="-mx-5 -mb-5">
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-4">
                <p className="text-sm text-slate-500">Manage fields of this object</p>
                <div className="flex gap-2">
                  <Button
                    as={Link}
                    to={`/admin/objects/${oid}/fields/reorder`}
                    variant="secondary"
                    size="sm"
                    icon={ArrowUpDown}
                  >
                    Reorder
                  </Button>
                  <Button as={Link} to={`/admin/objects/${oid}/fields/new`} size="sm" icon={Plus}>
                    Add Field
                  </Button>
                </div>
              </div>
              <FieldTable
                objectId={oid}
                fields={fields}
                onDelete={setDeletingField}
                emptyAction={
                  <Button as={Link} to={`/admin/objects/${oid}/fields/new`} size="sm" icon={Plus}>
                    Add Field
                  </Button>
                }
              />
            </div>
          )}

          {tab === 'settings' && (
            <ObjectSettingsTab
              object={object}
              stats={stats.data}
              busy={busy}
              onPublish={() => lifecycle('Object published', () => objectsApi.publish(oid))}
              onArchive={() => lifecycle('Object archived', () => objectsApi.archive(oid))}
              onRestore={() => lifecycle('Object restored', () => objectsApi.restore(oid))}
              onClone={() => setCloning(true)}
            />
          )}

          {tab === 'permissions' && <ObjectPermissionsTab object={object} />}
          {tab === 'history' && <ObjectHistoryTab objectId={oid} />}
        </div>
      </Card>

      <CloneObjectDialog
        object={cloning ? object : null}
        onClose={() => setCloning(false)}
        onCloned={async (created) => {
          setCloning(false);
          await invalidate();
          toast.success('Object cloned', `${created?.label ?? 'Copy'} created as a draft`);
          if (created?.objectId) navigate(`/admin/objects/${created.objectId}`);
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingField)}
        onClose={() => setDeletingField(null)}
        title={`Delete field "${deletingField?.label ?? ''}"?`}
        description="Records keep their stored value but the field stops rendering."
        note="Deletion is blocked if another object's lookup uses this field as its display field."
        confirmLabel="Delete field"
        loading={busy}
        onConfirm={async () => {
          const target = deletingField;
          setDeletingField(null);
          await lifecycle('Field deleted', () => fieldsApi.remove(oid, target.fieldId));
        }}
      />
    </>
  );
}

export default ObjectEditPage;
