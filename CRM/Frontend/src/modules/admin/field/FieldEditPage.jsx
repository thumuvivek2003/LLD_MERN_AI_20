import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { History, Info, Settings2, ShieldCheck, Trash2 } from 'lucide-react';
import useObject from '../../../core/hooks/useObject.js';
import useFields from '../../../core/hooks/useFields.js';
import useAsync from '../../../core/hooks/useAsync.js';
import auditApi from '../../../core/api/audit.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { toFieldDraft, toFieldPayload, validateFieldDraft } from '../../../shared/dto/field.dto.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import { Tabs } from '../../../core/components/ui/Tabs.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import ConfirmDialog from '../../../core/components/ui/ConfirmDialog.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import { fieldTypeIcon } from '../../../core/fields/registry.js';
import FieldInfoStep from '../components/field/FieldInfoStep.jsx';
import FieldSettingsStep from '../components/field/FieldSettingsStep.jsx';
import FieldValidationStep from '../components/field/FieldValidationStep.jsx';
import ActivityFeed from '../components/ActivityFeed.jsx';

const TABS = [
  { id: 'details', label: 'Details', icon: Info },
  { id: 'validation', label: 'Validation', icon: ShieldCheck },
  { id: 'advanced', label: 'Advanced', icon: Settings2 },
  { id: 'history', label: 'History', icon: History },
];

/** Admin screens 8 + 9 — Edit Field with Details · Validation · Advanced · History. */
export function FieldEditPage() {
  const { oid, fid } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'details';

  const { object } = useObject(oid);
  const { fields, loading, error, reload, update, remove } = useFields(oid);
  const field = fields.find((item) => item.fieldId === fid);

  const [draft, setDraft] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const history = useAsync(
    () => (tab === 'history' ? auditApi.list({ objectId: oid, limit: 20 }) : Promise.resolve([])),
    [tab, oid],
    { initialData: [] },
  );

  useEffect(() => {
    if (field) setDraft(toFieldDraft(field));
  }, [field]);

  const save = async () => {
    const found = validateFieldDraft(draft);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    try {
      const { type, ...patch } = toFieldPayload(draft);
      await update(fid, patch);
      toast.success('Field updated');
    } catch (err) {
      if (err.isValidation) setErrors(err.toFieldErrors());
      toast.fromError(err, 'Could not update field');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !field) {
    return (
      <Card className="p-6">
        <SkeletonText lines={7} />
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
  if (!field || !draft) {
    return (
      <Card>
        <ErrorState
          error={{ code: 'NOT_FOUND', message: 'This field no longer exists on the object.' }}
          onRetry={reload}
        />
      </Card>
    );
  }

  const Icon = fieldTypeIcon(field.type);
  const hasRecords = (object?.recordCount ?? 0) > 0;

  return (
    <>
      <PageHeader
        title={`Edit Field: ${field.label}`}
        subtitle={`${object?.label ?? oid} · ${field.apiName}`}
        icon={Icon}
        back={`/admin/objects/${oid}?tab=fields`}
        breadcrumbs={[
          { label: 'Objects', to: '/admin/objects' },
          { label: object?.label ?? oid, to: `/admin/objects/${oid}` },
          { label: 'Fields', to: `/admin/objects/${oid}/fields` },
          { label: field.label },
        ]}
        actions={
          <>
            <Button variant="danger-outline" icon={Trash2} onClick={() => setDeleting(true)}>
              Delete
            </Button>
            <Button onClick={save} loading={saving}>
              Save Changes
            </Button>
          </>
        }
      />

      <Card>
        <div className="px-5 pt-4">
          <Tabs tabs={TABS} active={tab} onChange={(next) => setParams({ tab: next })} />
        </div>
        <div className="p-5">
          {tab === 'details' && (
            <FieldInfoStep draft={draft} onChange={setDraft} errors={errors} lockType={hasRecords} />
          )}
          {tab === 'validation' && (
            <FieldValidationStep draft={draft} onChange={setDraft} errors={errors} />
          )}
          {tab === 'advanced' && (
            <FieldSettingsStep draft={draft} onChange={setDraft} errors={errors} objectId={oid} />
          )}
          {tab === 'history' && (
            <div className="-mx-5 -mb-5">
              <ActivityFeed
                entries={history.data}
                loading={history.loading}
                error={history.error}
                onRetry={history.reload}
                emptyTitle="No changes recorded for this object yet"
              />
            </div>
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        title={`Delete field "${field.label}"?`}
        description="The field stops rendering on every form and list."
        note="Blocked with a CONFLICT if another object's lookup uses it as a display field."
        confirmLabel="Delete field"
        loading={saving}
        onConfirm={async () => {
          setSaving(true);
          try {
            await remove(fid);
            toast.success('Field deleted');
            navigate(`/admin/objects/${oid}?tab=fields`);
          } catch (err) {
            toast.fromError(err, 'Could not delete field');
            setSaving(false);
            setDeleting(false);
          }
        }}
      />
    </>
  );
}

export default FieldEditPage;
