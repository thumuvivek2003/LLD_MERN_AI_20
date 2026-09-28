import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useObject from '../../../core/hooks/useObject.js';
import usePermission from '../../../core/hooks/usePermission.js';
import recordsApi from '../../../core/api/records.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import DynamicForm from '../../../core/components/form/DynamicForm.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { EmptyState, ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import { resolveIcon } from '../../../core/utils/icons.js';

/** Business screen 5 — Create record from a form generated entirely from metadata. */
export function RecordCreatePage() {
  const { oid } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const permission = usePermission(oid);
  const { object, fields, loading, error, reload } = useObject(oid);
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (recordJson) => {
    setSubmitting(true);
    try {
      const created = await recordsApi.create(oid, recordJson);
      toast.success('Record created', created?.displayName || 'Saved successfully');
      navigate(`/business/objects/${oid}/records/${created.recordId}`);
    } catch (err) {
      if (err.isValidation) formRef.current?.applyServerErrors(err.toFieldErrors());
      toast.fromError(err, 'Could not create record');
      setSubmitting(false);
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
        <ErrorState error={error} onRetry={reload} />
      </Card>
    );
  }
  if (!permission.canCreate) {
    return (
      <Card>
        <EmptyState
          title="You cannot create records here"
          description="Your role does not have Create permission on this object."
        />
      </Card>
    );
  }

  const Icon = resolveIcon(object?.icon);

  return (
    <>
      <PageHeader
        title={`New ${object?.label ?? 'Record'}`}
        subtitle={`Fill in the details to create a new ${object?.label?.toLowerCase() ?? 'record'}.`}
        icon={Icon}
        back={`/business/objects/${oid}/records`}
        breadcrumbs={[
          { label: 'My Objects', to: '/business/objects' },
          { label: object?.label ?? oid, to: `/business/objects/${oid}/records` },
          { label: 'New record' },
        ]}
      />

      <Card className="p-6">
        <DynamicForm
          ref={formRef}
          objectId={oid}
          fields={fields}
          title={`${object?.label ?? 'Record'} Information`}
          submitLabel="Save"
          submitting={submitting}
          onSubmit={submit}
          onCancel={() => navigate(`/business/objects/${oid}/records`)}
        />
      </Card>
    </>
  );
}

export default RecordCreatePage;
