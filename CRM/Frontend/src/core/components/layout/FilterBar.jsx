import { Plus, Search, Trash2, X } from 'lucide-react';
import { operatorsFor } from '../../fields/registry.js';
import {
  OPERATOR,
  OPERATOR_LABEL,
  RANGE_OPERATORS,
  VALUELESS_OPERATORS,
} from '../../../shared/enums/operator.enum.js';
import Button from '../ui/Button.jsx';
import Select from '../ui/Select.jsx';
import Badge from '../ui/Badge.jsx';
import FieldRenderer from '../form/FieldRenderer.jsx';

/**
 * Filter-row builder: field select → operator select → value widget.
 * BOTH the operator list and the value widget come from the field-type registry,
 * so a new field type brings its own filtering behaviour with it.
 *
 * State is owned by the page (an array of `{ id, fieldId, operator, value }` rows)
 * and fed to `SearchQueryBuilder` — this component only edits rows.
 */
export function FilterBar({
  fields = [],
  rows = [],
  onChange,
  onSearch,
  onClear,
  onSaveView,
  searching = false,
  logic,
  onLogicChange,
}) {
  const filterable = fields.filter((field) => field.filterable !== false);
  const fieldOptions = filterable.map((field) => ({ value: field.fieldId, label: field.label }));

  const patch = (id, changes) =>
    onChange(rows.map((row) => (row.id === id ? { ...row, ...changes } : row)));

  const onFieldChange = (row, fieldId) => {
    const field = filterable.find((item) => item.fieldId === fieldId);
    const [firstOperator] = field ? operatorsFor(field.type) : [OPERATOR.eq];
    patch(row.id, { fieldId, operator: firstOperator, value: '' });
  };

  const addRow = () =>
    onChange([
      ...rows,
      {
        id: `flt_${Math.random().toString(36).slice(2, 9)}`,
        fieldId: filterable[0]?.fieldId ?? '',
        operator: OPERATOR.eq,
        value: '',
      },
    ]);

  const removeRow = (id) => onChange(rows.filter((row) => row.id !== id));

  return (
    <div className="space-y-3">
      {rows.map((row) => {
        const field = filterable.find((item) => item.fieldId === row.fieldId);
        const operators = field ? operatorsFor(field.type) : [OPERATOR.eq];
        const needsValue = !VALUELESS_OPERATORS.includes(row.operator);
        const isRange = RANGE_OPERATORS.includes(row.operator);

        return (
          <div key={row.id} className="flex flex-wrap items-start gap-2">
            <Select
              className="w-full sm:w-44"
              value={row.fieldId}
              placeholder="Select field"
              options={fieldOptions}
              onChange={(event) => onFieldChange(row, event.target.value)}
            />
            <Select
              className="w-full sm:w-40"
              value={row.operator}
              options={operators.map((operator) => ({
                value: operator,
                label: OPERATOR_LABEL[operator],
              }))}
              onChange={(event) => patch(row.id, { operator: event.target.value, value: '' })}
            />
            {needsValue && field && (
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {isRange ? (
                  <>
                    <div className="min-w-0 flex-1">
                      <FieldRenderer
                        field={field}
                        mode="filter"
                        value={Array.isArray(row.value) ? row.value[0] : ''}
                        onChange={(value) =>
                          patch(row.id, {
                            value: [value, Array.isArray(row.value) ? row.value[1] : ''],
                          })
                        }
                      />
                    </div>
                    <span className="text-xs text-slate-400">and</span>
                    <div className="min-w-0 flex-1">
                      <FieldRenderer
                        field={field}
                        mode="filter"
                        value={Array.isArray(row.value) ? row.value[1] : ''}
                        onChange={(value) =>
                          patch(row.id, {
                            value: [Array.isArray(row.value) ? row.value[0] : '', value],
                          })
                        }
                      />
                    </div>
                  </>
                ) : (
                  <div className="min-w-0 flex-1">
                    <FieldRenderer
                      field={field}
                      mode="filter"
                      value={row.value}
                      onChange={(value) => patch(row.id, { value })}
                    />
                  </div>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              aria-label="Remove filter"
              className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      })}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <Button variant="soft" size="sm" icon={Plus} onClick={addRow}>
            Add Filter
          </Button>
          {rows.length > 1 && onLogicChange && (
            <Select
              size="sm"
              className="w-24"
              value={logic}
              onChange={(event) => onLogicChange(event.target.value)}
              options={[
                { value: 'AND', label: 'Match ALL' },
                { value: 'OR', label: 'Match ANY' },
              ]}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-semibold text-slate-500 transition hover:text-slate-700"
            >
              Clear All
            </button>
          )}
          {onSaveView && (
            <Button variant="secondary" size="md" onClick={onSaveView}>
              Save View
            </Button>
          )}
          <Button size="md" icon={Search} loading={searching} onClick={onSearch}>
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Read-only chips summarising the applied filters (Admin → Search & Filter Records). */
export function FilterChips({ rows = [], fields = [], onRemove }) {
  if (!rows.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {rows.map((row) => {
        const field = fields.find((item) => item.fieldId === row.fieldId);
        if (!field) return null;
        const value = Array.isArray(row.value) ? row.value.join(' – ') : row.value;
        return (
          <Badge key={row.id} tone="sky" className="pr-1">
            <span>
              {field.label} {OPERATOR_LABEL[row.operator]}
              {value !== '' && value !== undefined ? ` ${value}` : ''}
            </span>
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(row.id)}
                aria-label={`Remove ${field.label} filter`}
                className="rounded p-0.5 transition hover:bg-sky-100"
              >
                <X size={11} />
              </button>
            )}
          </Badge>
        );
      })}
    </div>
  );
}

export default FilterBar;
