import { fieldIndexType, fieldTypeList } from '../../../../core/fields/registry.js';
import { INDEX_TYPE_LABEL } from '../../../../shared/enums/index-type.enum.js';
import { toApiName } from '../../../../core/utils/formatters.js';
import { Input } from '../../../../core/components/ui/Input.jsx';
import Select from '../../../../core/components/ui/Select.jsx';
import Badge from '../../../../core/components/ui/Badge.jsx';
import ValidationMessage from '../../../../core/components/form/ValidationMessage.jsx';

/**
 * Step 1 of Add Field — label, API name, type.
 * The type list comes from the field-type registry, so registering a new type
 * makes it selectable here with no edit to this file.
 */
export function FieldInfoStep({ draft, onChange, errors = {}, lockType = false }) {
  const patch = (changes) => onChange({ ...draft, ...changes });

  return (
    <div className="space-y-4">
      <div>
        <label className="mf-label" htmlFor="fieldinfostep-field-label">
          Field Label <span className="text-rose-500">*</span>
        </label>
        <Input
          id="fieldinfostep-field-label"
          autoFocus
          value={draft.label}
          invalid={Boolean(errors.label)}
          placeholder="Customer Name"
          onChange={(event) =>
            patch({
              label: event.target.value,
              apiName: draft.apiNameTouched ? draft.apiName : toApiName(event.target.value),
            })
          }
        />
        <ValidationMessage message={errors.label} />
      </div>

      <div>
        <label className="mf-label" htmlFor="fieldinfostep-field-api-name">
          Field API Name <span className="text-rose-500">*</span>
        </label>
        <Input
          id="fieldinfostep-field-api-name"
          value={draft.apiName}
          invalid={Boolean(errors.apiName)}
          placeholder="customerName"
          onChange={(event) => patch({ apiName: event.target.value, apiNameTouched: true })}
        />
        <ValidationMessage message={errors.apiName} />
      </div>

      <div>
        <label className="mf-label" htmlFor="fieldinfostep-field-type">
          Field Type <span className="text-rose-500">*</span>
        </label>
        <Select
          id="fieldinfostep-field-type"
          value={draft.type}
          disabled={lockType}
          invalid={Boolean(errors.type)}
          onChange={(event) => patch({ type: event.target.value })}
          options={fieldTypeList().map((strategy) => ({
            value: strategy.type,
            label: strategy.label,
          }))}
        />
        {lockType ? (
          <p className="mt-1.5 text-[11px] text-slate-400">
            Field type cannot change once records exist.
          </p>
        ) : (
          <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-400">
            Indexed as
            <Badge tone="sky">{INDEX_TYPE_LABEL[fieldIndexType(draft.type)]}</Badge>
          </p>
        )}
      </div>

      <div>
        <label className="mf-label" htmlFor="fieldinfostep-help-text">Help Text</label>
        <Input
          id="fieldinfostep-help-text"
          value={draft.helpText}
          placeholder="Shown under the input on record forms"
          onChange={(event) => patch({ helpText: event.target.value })}
        />
      </div>
    </div>
  );
}

export default FieldInfoStep;
