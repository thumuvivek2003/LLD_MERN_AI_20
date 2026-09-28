import { Check, Minus } from 'lucide-react';
import { fieldIndexType, fieldTypeIcon, fieldTypeLabel } from '../../../../core/fields/registry.js';
import { INDEX_TYPE_LABEL } from '../../../../shared/enums/index-type.enum.js';
import Badge from '../../../../core/components/ui/Badge.jsx';

const Row = ({ label, value }) => (
  <div className="flex items-start justify-between gap-6 border-b border-slate-100 py-2.5 last:border-0">
    <dt className="text-xs font-medium text-slate-500">{label}</dt>
    <dd className="text-right text-sm font-medium text-slate-800">{value}</dd>
  </div>
);

const Flag = ({ on }) =>
  on ? (
    <Check size={14} className="inline text-emerald-500" strokeWidth={3} />
  ) : (
    <Minus size={14} className="inline text-slate-300" />
  );

/** Final step of the Add Field wizard. */
export function FieldReviewStep({ draft, objectLabel }) {
  const Icon = fieldTypeIcon(draft.type);
  const validation = draft.validation || {};
  const rules = [
    draft.required && 'Required',
    draft.unique && 'Unique',
    validation.minLength != null && validation.minLength !== '' && `Min length ${validation.minLength}`,
    validation.maxLength != null && validation.maxLength !== '' && `Max length ${validation.maxLength}`,
    validation.min != null && validation.min !== '' && `Min ${validation.min}`,
    validation.max != null && validation.max !== '' && `Max ${validation.max}`,
    validation.regex && 'Custom regex',
  ].filter(Boolean);

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Icon size={20} />
        </span>
        <div>
          <p className="text-base font-bold text-slate-900">{draft.label || 'Untitled field'}</p>
          <p className="font-mono text-xs text-slate-400">{draft.apiName}</p>
        </div>
      </div>

      <dl>
        <Row label="Object" value={objectLabel} />
        <Row label="Type" value={fieldTypeLabel(draft.type)} />
        <Row label="Index" value={<Badge tone="sky">{INDEX_TYPE_LABEL[fieldIndexType(draft.type)]}</Badge>} />
        <Row label="Required" value={<Flag on={draft.required} />} />
        <Row label="Searchable" value={<Flag on={draft.searchable} />} />
        <Row label="Sortable" value={<Flag on={draft.sortable} />} />
        <Row label="Filterable" value={<Flag on={draft.filterable} />} />
        {draft.options?.length > 0 && (
          <Row
            label="Options"
            value={
              <span className="flex flex-wrap justify-end gap-1">
                {draft.options
                  .filter((option) => option.value)
                  .map((option) => (
                    <Badge key={option.value} tone={option.color || 'slate'}>
                      {option.label || option.value}
                    </Badge>
                  ))}
              </span>
            }
          />
        )}
        {draft.lookup?.objectId && <Row label="Related object" value={draft.lookup.objectId} />}
        <Row label="Validation rules" value={rules.length ? rules.join(' · ') : 'None'} />
      </dl>

      {draft.searchable && (
        <p className="mt-5 rounded-lg bg-accent-soft px-3.5 py-3 text-[11px] leading-relaxed text-accent-ink">
          Making this field searchable queues an index build. Watch its progress under
          Indexes or in the System console.
        </p>
      )}
    </div>
  );
}

export default FieldReviewStep;
