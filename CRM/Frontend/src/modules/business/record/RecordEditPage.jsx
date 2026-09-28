import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useObject from '../../../core/hooks/useObject.js';
import useRecord from '../../../core/hooks/useRecord.js';
import usePermission from '../../../core/hooks/usePermission.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { recordTitle } from '../../../shared/mapper/record.mapper.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import DynamicForm from '../../../core/components/form/DynamicForm.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { EmptyState, ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import { resolveIcon } from '../../../core/utils/icons.js';

/** Business screen 6 — Edit record. Same DynamicForm, seeded with `recordJson`. */
export function RecordEditPage() {
  const { oid, rid } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const permission = usePermission(oid);
  const { object, fields } = useObject(oid);
  const { record, resolved, loading, error, reload, update } = useRecord(oid, rid);
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (recordJson) => {
    setSubmitting(true);
    try {
      await update(recordJson);
      toast.success('Record updated');
      navigate(`/business/objects/${oid}/records/${rid}`);
    } catch (err) {
      if (err.isValidation) formRef.current?.applyServerErrors(err.toFieldErrors());
      toast.fromError(err, 'Could not update record');
      setSubmitting(false);
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
  if (!permission.canUpdate) {
    return (
      <Card>
        <EmptyState
          title="You cannot edit this record"
          description="Your role does not have Update permission on this object."
        />
      </Card>
    );
  }

  const Icon = resolveIcon(object?.icon);
  const title = recordTitle(object, record);

  return (
    <>
      <PageHeader
        title={`Edit ${object?.label ?? 'Record'}`}
        subtitle={`Update the ${object?.label?.toLowerCase() ?? 'record'} information.`}
        icon={Icon}
        back={`/business/objects/${oid}/records/${rid}`}
        breadcrumbs={[
          { label: 'My Objects', to: '/business/objects' },
          { label: object?.label ?? oid, to: `/business/objects/${oid}/records` },
          { label: title, to: `/business/objects/${oid}/records/${rid}` },
          { label: 'Edit' },
        ]}
      />

      <Card className="p-6">
        <DynamicForm
          ref={formRef}
          objectId={oid}
          fields={fields}
          initialValues={record.recordJson}
          resolved={resolved}
          title={`${object?.label ?? 'Record'} Information`}
          submitLabel="Update"
          submitting={submitting}
          onSubmit={submit}
          onCancel={() => navigate(`/business/objects/${oid}/records/${rid}`)}
        />
      </Card>
    </>
  );
}

export default RecordEditPage;
