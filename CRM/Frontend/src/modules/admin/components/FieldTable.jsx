import { Check, Database, ListTree, Minus, Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fieldTypeIcon, fieldTypeLabel } from '../../../core/fields/registry.js';
import DataTable from '../../../core/components/table/DataTable.jsx';
import Badge from '../../../core/components/ui/Badge.jsx';

const Flag = ({ on }) =>
  on ? (
    <Check size={15} className="text-emerald-500" strokeWidth={3} />
  ) : (
    <Minus size={14} className="text-slate-300" />
  );

/**
 * Field list table — shared by Admin screen 6 (Fields list) and the
 * Edit Object → Fields tab, so both stay in sync.
 */
export function FieldTable({ objectId, fields, loading, error, onRetry, onDelete, emptyAction }) {
  const navigate = useNavigate();

  const columns = [
    {
      key: 'label',
      header: 'Field Label',
      className: 'font-semibold text-slate-800',
      render: (field) => {
        const Icon = fieldTypeIcon(field.type);
        return (
          <span className="flex items-center gap-2">
            <Icon size={14} className="text-slate-400" />
            {field.label}
            {field.readOnly && <Badge tone="slate">Read only</Badge>}
          </span>
        );
      },
    },
    {
      key: 'apiName',
      header: 'API Name',
      render: (field) => <span className="font-mono text-xs text-slate-400">{field.apiName}</span>,
    },
    { key: 'type', header: 'Type', render: (field) => fieldTypeLabel(field.type) },
    { key: 'required', header: 'Required', align: 'center', render: (field) => <Flag on={field.required} /> },
    {
      key: 'searchable',
      header: 'Searchable',
      align: 'center',
      render: (field) => <Flag on={field.searchable} />,
    },
    { key: 'unique', header: 'Unique', align: 'center', render: (field) => <Flag on={field.unique} /> },
  ];

  const rowActions = (field) => [
    {
      id: 'edit',
      label: 'Edit field',
      icon: Pencil,
      onSelect: () => navigate(`/admin/objects/${objectId}/fields/${field.fieldId}`),
    },
    {
      id: 'validation',
      label: 'Validation rules',
      icon: ShieldCheck,
      onSelect: () => navigate(`/admin/objects/${objectId}/fields/${field.fieldId}?tab=validation`),
    },
    {
      id: 'index',
      label: 'Index settings',
      icon: Database,
      onSelect: () => navigate(`/admin/indexes?objectId=${objectId}`),
    },
    onDelete && {
      id: 'delete',
      label: 'Delete field',
      icon: Trash2,
      tone: 'danger',
      onSelect: () => onDelete(field),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={fields}
      rowKey={(field) => field.fieldId}
      loading={loading}
      error={error}
      onRetry={onRetry}
      rowActions={rowActions}
      onRowClick={(field) => navigate(`/admin/objects/${objectId}/fields/${field.fieldId}`)}
      emptyIcon={ListTree}
      emptyTitle="No fields yet"
      emptyDescription="Add the first field so records have something to store."
      emptyAction={emptyAction}
    />
  );
}

export default FieldTable;
