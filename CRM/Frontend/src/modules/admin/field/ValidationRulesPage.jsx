import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import useFields from '../../../core/hooks/useFields.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import Badge from '../../../core/components/ui/Badge.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { fieldTypeLabel } from '../../../core/fields/registry.js';

/** Derives the human-readable rule list attached to a field's `validation` block. */
const rulesOf = (field) => {
  const validation = field.validation || {};
  return [
    field.required && { label: 'Required', tone: 'rose' },
    field.unique && { label: 'Unique', tone: 'violet' },
    validation.minLength != null && { label: `Min length ${validation.minLength}`, tone: 'sky' },
    validation.maxLength != null && { label: `Max length ${validation.maxLength}`, tone: 'sky' },
    validation.min != null && { label: `Min ${validation.min}`, tone: 'amber' },
    validation.max != null && { label: `Max ${validation.max}`, tone: 'amber' },
    validation.regex && { label: 'Custom regex', tone: 'indigo' },
    ['EMAIL', 'URL', 'PHONE'].includes(field.type) && {
      label: `${fieldTypeLabel(field.type)} format`,
      tone: 'emerald',
    },
  ].filter(Boolean);
};

/** Admin sidebar → Validation Rules. Every rule configured on an object's fields. */
export function ValidationRulesPage() {
  const { objects } = useMetadata();
  const [objectId, setObjectId] = useState('');

  useEffect(() => {
    if (!objectId && objects.length) setObjectId(objects[0].objectId);
  }, [objects, objectId]);

  const { fields, loading, error, reload } = useFields(objectId);

  const rows = useMemo(
    () => fields.map((field) => ({ ...field, rules: rulesOf(field) })).filter((field) => field.rules.length),
    [fields],
  );

  const columns = [
    {
      key: 'label',
      header: 'Field',
      className: 'font-semibold text-slate-800',
      render: (field) => (
        <Link to={`/admin/objects/${objectId}/fields/${field.fieldId}?tab=validation`} className="hover:text-accent">
          {field.label}
        </Link>
      ),
    },
    { key: 'type', header: 'Type', render: (field) => fieldTypeLabel(field.type) },
    {
      key: 'rules',
      header: 'Rules',
      render: (field) => (
        <span className="flex flex-wrap gap-1">
          {field.rules.map((rule) => (
            <Badge key={rule.label} tone={rule.tone}>
              {rule.label}
            </Badge>
          ))}
        </span>
      ),
    },
    {
      key: 'message',
      header: 'Custom Message',
      render: (field) => field.validation?.message || <span className="text-slate-300">—</span>,
    },
  ];

  return (
    <>
      <PageHeader
        title="Validation Rules"
        subtitle="Every constraint enforced before a record is saved"
        icon={ShieldCheck}
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <Select
            className="w-56"
            value={objectId}
            onChange={(event) => setObjectId(event.target.value)}
            options={objects.map((object) => ({ value: object.objectId, label: object.label }))}
          />
          <span className="text-xs text-slate-400">
            {rows.length} of {fields.length} fields carry validation rules
          </span>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(field) => field.fieldId}
          loading={loading}
          error={error}
          onRetry={reload}
          emptyIcon={ShieldCheck}
          emptyTitle="No validation rules configured"
          emptyDescription="Open a field and switch to its Validation tab to add constraints."
          emptyAction={
            objectId ? (
              <Button as={Link} to={`/admin/objects/${objectId}/fields`} size="sm" variant="secondary">
                Manage fields
              </Button>
            ) : null
          }
        />
      </Card>
    </>
  );
}

export default ValidationRulesPage;
