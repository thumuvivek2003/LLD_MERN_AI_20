import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Archive, ArchiveRestore, Layers, Pencil } from 'lucide-react';
import useObject from '../../../core/hooks/useObject.js';
import useRecords from '../../../core/hooks/useRecords.js';
import usePagination from '../../../core/hooks/usePagination.js';
import usePermission from '../../../core/hooks/usePermission.js';
import recordsApi from '../../../core/api/records.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { coerceValue } from '../../../core/fields/registry.js';
import { recordColumns } from '../../../shared/mapper/record.mapper.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import Pagination from '../../../core/components/ui/Pagination.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import FieldRenderer from '../../../core/components/form/FieldRenderer.jsx';
import BulkResultSummary from '../../admin/components/BulkResultSummary.jsx';

const ACTIONS = [
  { value: 'UPDATE', label: 'Update Field', icon: Pencil },
  { value: 'ARCHIVE', label: 'Archive', icon: Archive },
  { value: 'RESTORE', label: 'Restore', icon: ArchiveRestore },
];

/** Business screen 9 — select records on this page and apply one action to all of them. */
export function BulkActionsPage() {
  const { oid } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const permission = usePermission(oid);
  const { object, fields } = useObject(oid);

  const [selected, setSelected] = useState([]);
  const [action, setAction] = useState('UPDATE');
  const [fieldId, setFieldId] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const pager = usePagination({ initialLimit: 25 });

  const { records, meta, loading, error, reload } = useRecords(oid, {
    page: pager.page,
    limit: pager.limit,
  });

  const editable = useMemo(
    () => permission.visibleFields(fields).filter((field) => permission.isFieldEditable(field)),
    [fields, permission],
  );
  const columns = useMemo(() => recordColumns(editable.slice(0, 5)), [editable]);
  const targetField = editable.find((field) => field.fieldId === fieldId);

  const apply = async () => {
    setSubmitting(true);
    try {
      const outcome = await recordsApi.bulk(oid, {
        action,
        recordIds: selected,
        ...(action === 'UPDATE' && targetField
          ? { patch: { [fieldId]: coerceValue(targetField, value) } }
          : {}),
      });
      setResult(outcome);
      toast.success('Bulk action applied', `${outcome?.succeeded ?? 0} records updated`);
      setSelected([]);
      await reload();
    } catch (err) {
      toast.fromError(err, 'Bulk action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const disabled =
    !selected.length || (action === 'UPDATE' && (!fieldId || value === '')) || !permission.canUpdate;

  return (
    <>
      <PageHeader
        title="Bulk Actions"
        subtitle={`Apply one change to many ${object?.pluralLabel?.toLowerCase() ?? 'records'} at once`}
        icon={Layers}
        back={`/business/objects/${oid}/records`}
        breadcrumbs={[
          { label: 'My Objects', to: '/business/objects' },
          { label: object?.label ?? oid, to: `/business/objects/${oid}/records` },
          { label: 'Bulk actions' },
        ]}
      />

      {result ? (
        <Card className="p-5">
          <BulkResultSummary
            result={result}
            onDone={() => navigate(`/business/objects/${oid}/records`)}
            doneLabel="Back to records"
          />
        </Card>
      ) : (
        <div className="space-y-5">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
              <p className="text-sm text-slate-600">
                <span className="font-bold text-slate-900">{selected.length}</span> records selected
                on this page
              </p>
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelected([])}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Clear selection
                </button>
              )}
            </div>

            <DataTable
              columns={columns}
              rows={records}
              rowKey={(record) => record.recordId}
              loading={loading}
              error={error}
              onRetry={reload}
              selectable
              selectedIds={selected}
              onSelectionChange={setSelected}
              emptyIcon={Layers}
              emptyTitle="No records to select"
            />

            <Pagination
              page={pager.page}
              limit={pager.limit}
              total={meta?.total ?? records.length}
              totalPages={meta?.totalPages}
              onPageChange={pager.setPage}
              onLimitChange={pager.setLimit}
            />
          </Card>

          <Card className="p-5">
            <div className="grid items-end gap-4 sm:grid-cols-3">
              <div>
                <label className="mf-label" htmlFor="bulkactionspage-action">Action</label>
                <Select
                  id="bulkactionspage-action"
                  value={action}
                  onChange={(event) => setAction(event.target.value)}
                  options={ACTIONS.map((option) => ({ value: option.value, label: option.label }))}
                />
              </div>
              {action === 'UPDATE' && (
                <>
                  <div>
                    <label className="mf-label" htmlFor="bulkactionspage-field">Field</label>
                    <Select
                      id="bulkactionspage-field"
                      value={fieldId}
                      placeholder="Select field"
                      onChange={(event) => {
                        setFieldId(event.target.value);
                        setValue('');
                      }}
                      options={editable.map((field) => ({
                        value: field.fieldId,
                        label: field.label,
                      }))}
                    />
                  </div>
                  <div>
                    <label className="mf-label">New value</label>
                    {targetField ? (
                      <FieldRenderer field={targetField} mode="filter" value={value} onChange={setValue} />
                    ) : (
                      <Select disabled placeholder="Choose a field first" options={[]} />
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button variant="secondary" onClick={() => navigate(`/business/objects/${oid}/records`)}>
                Cancel
              </Button>
              <Button loading={submitting} disabled={disabled} onClick={apply}>
                Apply
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

export default BulkActionsPage;
