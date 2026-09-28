import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Archive, ArchiveRestore, ChevronLeft, ChevronRight, Layers, Pencil } from 'lucide-react';
import useObject from '../../../core/hooks/useObject.js';
import useRecords from '../../../core/hooks/useRecords.js';
import usePagination from '../../../core/hooks/usePagination.js';
import usePermission from '../../../core/hooks/usePermission.js';
import recordsApi from '../../../core/api/records.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { recordColumns } from '../../../shared/mapper/record.mapper.jsx';
import { coerceValue } from '../../../core/fields/registry.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import { StepperBar } from '../../../core/components/ui/Stepper.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import Pagination from '../../../core/components/ui/Pagination.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import FieldRenderer from '../../../core/components/form/FieldRenderer.jsx';
import BulkResultSummary from '../components/BulkResultSummary.jsx';

const STEPS = [
  { id: 'select', label: 'Select Records' },
  { id: 'action', label: 'Choose Action' },
  { id: 'confirm', label: 'Review & Confirm' },
];

const ACTIONS = [
  { value: 'UPDATE', label: 'Update a field', icon: Pencil },
  { value: 'ARCHIVE', label: 'Archive records', icon: Archive },
  { value: 'RESTORE', label: 'Restore records', icon: ArchiveRestore },
];

/** Admin screen 16 — Bulk operations, 3-step wizard over `POST /records/bulk`. */
export function BulkOperationsPage() {
  const { oid } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const permission = usePermission(oid);
  const { object, fields } = useObject(oid);

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState([]);
  const [action, setAction] = useState('UPDATE');
  const [fieldId, setFieldId] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const pager = usePagination({ initialLimit: 10 });

  const { records, meta, loading, error, reload } = useRecords(oid, {
    page: pager.page,
    limit: pager.limit,
  });

  const editable = useMemo(
    () => permission.visibleFields(fields).filter((field) => permission.isFieldEditable(field)),
    [fields, permission],
  );
  const columns = useMemo(() => recordColumns(editable.slice(0, 4)), [editable]);
  const targetField = editable.find((field) => field.fieldId === fieldId);

  const canAdvance =
    (step === 0 && selected.length > 0) ||
    (step === 1 && (action !== 'UPDATE' || (fieldId && value !== '')));

  const submit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        action,
        recordIds: selected,
        ...(action === 'UPDATE' && targetField
          ? { patch: { [fieldId]: coerceValue(targetField, value) } }
          : {}),
      };
      const outcome = await recordsApi.bulk(oid, payload);
      setResult(outcome);
      toast.success(
        'Bulk operation complete',
        `${outcome?.succeeded ?? 0} succeeded, ${outcome?.failed ?? 0} failed`,
      );
      await reload();
      setSelected([]);
    } catch (err) {
      toast.fromError(err, 'Bulk operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Bulk Update Records"
        subtitle="Update multiple records at once"
        icon={Layers}
        back={`/admin/records/${oid}`}
        breadcrumbs={[
          { label: 'Records', to: '/admin/records' },
          { label: object?.label ?? oid, to: `/admin/records/${oid}` },
          { label: 'Bulk operations' },
        ]}
      />

      <Card>
        <div className="border-b border-slate-100 px-5 py-4">
          <StepperBar steps={STEPS} current={step} />
        </div>

        {step === 0 && (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
              <p className="text-sm text-slate-600">
                <span className="font-bold text-slate-900">{selected.length}</span> records selected
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
              emptyTitle="No records to operate on"
            />
            <Pagination
              page={pager.page}
              limit={pager.limit}
              total={meta?.total ?? records.length}
              totalPages={meta?.totalPages}
              onPageChange={pager.setPage}
              onLimitChange={pager.setLimit}
              limitOptions={[10, 25, 50]}
            />
          </>
        )}

        {step === 1 && (
          <div className="space-y-5 p-5">
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium text-slate-500">Selected Records</p>
              <p className="mt-0.5 text-lg font-bold text-slate-900">
                {selected.length} records selected
              </p>
            </div>

            <div>
              <label className="mf-label">Action</label>
              <div className="grid gap-2 sm:grid-cols-3">
                {ACTIONS.map((option) => {
                  const Icon = option.icon;
                  const active = action === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setAction(option.value)}
                      className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-3 text-left text-sm font-semibold transition ${
                        active
                          ? 'border-accent bg-accent-soft text-accent-ink'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={16} />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {action === 'UPDATE' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mf-label" htmlFor="bulkoperationspage-update-field">Update Field</label>
                  <Select
                    id="bulkoperationspage-update-field"
                    value={fieldId}
                    placeholder="Select field"
                    onChange={(event) => {
                      setFieldId(event.target.value);
                      setValue('');
                    }}
                    options={editable.map((field) => ({ value: field.fieldId, label: field.label }))}
                  />
                </div>
                <div>
                  <label className="mf-label">New Value</label>
                  {targetField ? (
                    <FieldRenderer field={targetField} mode="filter" value={value} onChange={setValue} />
                  ) : (
                    <Select disabled placeholder="Choose a field first" options={[]} />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 p-5">
            {result ? (
              <BulkResultSummary result={result} onDone={() => navigate(`/admin/records/${oid}`)} />
            ) : (
              <>
                <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200 px-4">
                  <Row label="Object" value={object?.label ?? oid} />
                  <Row label="Records affected" value={`${selected.length}`} />
                  <Row label="Action" value={ACTIONS.find((a) => a.value === action)?.label} />
                  {action === 'UPDATE' && (
                    <Row
                      label="Field change"
                      value={`${targetField?.label ?? '—'} → ${
                        value === '' || value === null ? '(empty)' : String(value)
                      }`}
                    />
                  )}
                </dl>
                <p className="rounded-lg bg-amber-50 px-3.5 py-3 text-[11px] leading-relaxed text-amber-800">
                  This runs immediately against {selected.length} records. Per-record failures are
                  reported back and do not roll back successful ones.
                </p>
              </>
            )}
          </div>
        )}

        {!result && (
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
            <Button variant="secondary" onClick={() => navigate(`/admin/records/${oid}`)}>
              Cancel
            </Button>
            {step > 0 && (
              <Button variant="secondary" icon={ChevronLeft} onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step < 2 ? (
              <Button iconRight={ChevronRight} disabled={!canAdvance} onClick={() => setStep(step + 1)}>
                Next
              </Button>
            ) : (
              <Button loading={submitting} onClick={submit}>
                Apply to {selected.length} records
              </Button>
            )}
          </div>
        )}
      </Card>
    </>
  );
}

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between gap-6 py-3">
    <dt className="text-xs font-medium text-slate-500">{label}</dt>
    <dd className="text-sm font-semibold text-slate-800">{value}</dd>
  </div>
);

export default BulkOperationsPage;
