import FieldRenderer from '../../core/components/form/FieldRenderer.jsx';

/**
 * Turns object metadata into DataTable columns.
 * Every cell renders through the field-type registry, so a table column
 * automatically gains display behaviour when a new field type is registered.
 */
export const recordColumns = (fields, { columnIds, onSort } = {}) => {
  const chosen = columnIds?.length
    ? columnIds.map((id) => fields.find((field) => field.fieldId === id)).filter(Boolean)
    : fields;

  return chosen.map((field, index) => ({
    key: field.fieldId,
    header: field.label,
    sortable: Boolean(onSort) && field.sortable !== false,
    className: index === 0 ? 'font-semibold text-slate-800' : undefined,
    render: (record) => (
      <FieldRenderer
        field={field}
        mode="display"
        value={record.recordJson?.[field.fieldId]}
        context={{ resolved: record.resolved }}
      />
    ),
  }));
};

/** First N fields — the default column set for a freshly opened list. */
export const defaultColumnIds = (fields, count = 5) =>
  fields.slice(0, count).map((field) => field.fieldId);

export const recordTitle = (object, record) => {
  if (!record) return '';
  if (record.displayName) return record.displayName;
  const primary = object?.primaryDisplayFieldId;
  return (primary && record.recordJson?.[primary]) || record.recordId;
};
