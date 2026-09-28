import FieldRenderer from '../form/FieldRenderer.jsx';
import { formatDateTime } from '../../utils/formatters.js';

/**
 * Two-column read-only field grid for a record's Overview tab.
 * Values render through the field-type registry; hidden fields are already
 * filtered out by the caller's `usePermission().visibleFields`.
 */
export function RecordOverview({ fields = [], record, resolved, extras = true }) {
  if (!record) return null;

  return (
    <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.fieldId} className="flex flex-col gap-1">
          <dt className="text-xs font-medium text-slate-500">{field.label}</dt>
          <dd className="text-sm font-medium text-slate-800">
            <FieldRenderer
              field={field}
              mode="display"
              value={record.recordJson?.[field.fieldId]}
              context={{ resolved }}
            />
          </dd>
        </div>
      ))}

      {extras && (
        <>
          <Meta label="Created On" value={formatDateTime(record.createdAt)} />
          <Meta label="Created By" value={record.createdBy} />
          <Meta label="Last Updated" value={formatDateTime(record.updatedAt)} />
          <Meta label="Updated By" value={record.updatedBy} />
        </>
      )}
    </dl>
  );
}

const Meta = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <dt className="text-xs font-medium text-slate-500">{label}</dt>
    <dd className="text-sm font-medium text-slate-800">{value || '—'}</dd>
  </div>
);

export default RecordOverview;
