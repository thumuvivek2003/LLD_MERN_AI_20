import { Braces, Code2, Mail, Ruler, ShieldCheck, Sigma } from 'lucide-react';
import { getFieldType } from '../../../../core/fields/registry.js';
import { ToggleRow } from '../../../../core/components/ui/Toggle.jsx';
import { Input } from '../../../../core/components/ui/Input.jsx';
import ValidationMessage from '../../../../core/components/form/ValidationMessage.jsx';

const supportsRule = (type, rule) => (getFieldType(type).supports?.validation || []).includes(rule);

/**
 * Admin screens 8 + 9 — Field properties & validation.
 * Toggle rows for Required / Format / Unique / Custom Regex plus numeric and
 * length bounds, driven by what the field type declares it supports.
 */
export function FieldValidationStep({ draft, onChange, errors = {} }) {
  const patch = (changes) => onChange({ ...draft, ...changes });
  const patchValidation = (changes) =>
    onChange({ ...draft, validation: { ...draft.validation, ...changes } });

  const strategy = getFieldType(draft.type);
  const hasFormatRule = ['EMAIL', 'URL', 'PHONE'].includes(draft.type);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 px-4">
        <ToggleRow
          icon={ShieldCheck}
          title="Required"
          description="Reject empty values"
          checked={draft.required}
          onChange={(required) => patch({ required })}
        />

        {hasFormatRule && (
          <ToggleRow
            icon={Mail}
            title={`${strategy.label} Format`}
            description={`Validate the value as ${strategy.label.toLowerCase()}`}
            checked
            disabled
          />
        )}

        {strategy.supports?.unique && (
          <ToggleRow
            icon={Braces}
            title="Unique"
            description="Ensure unique values across all records"
            checked={draft.unique}
            onChange={(unique) => patch({ unique })}
          />
        )}

        {supportsRule(draft.type, 'regex') && (
          <ToggleRow
            icon={Code2}
            title="Custom Regex"
            description="Values must match this pattern"
            checked={Boolean(draft.validation?.regex)}
            onChange={(on) => patchValidation({ regex: on ? draft.validation?.regex || '^.*$' : null })}
          >
            {draft.validation?.regex != null && (
              <>
                <Input
                  className="font-mono text-xs"
                  value={draft.validation.regex}
                  invalid={Boolean(errors.regex)}
                  placeholder="^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$"
                  onChange={(event) => patchValidation({ regex: event.target.value })}
                />
                <ValidationMessage message={errors.regex} />
                <Input
                  className="mt-2"
                  value={draft.validation.message ?? ''}
                  placeholder="Message shown when the pattern fails"
                  onChange={(event) => patchValidation({ message: event.target.value })}
                />
              </>
            )}
          </ToggleRow>
        )}
      </div>

      {(supportsRule(draft.type, 'minLength') || supportsRule(draft.type, 'maxLength')) && (
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Ruler size={14} className="text-slate-400" /> Length constraints
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mf-label">Minimum length</label>
              <Input
                type="number"
                value={draft.validation?.minLength ?? ''}
                onChange={(event) => patchValidation({ minLength: event.target.value })}
              />
            </div>
            <div>
              <label className="mf-label">Maximum length</label>
              <Input
                type="number"
                value={draft.validation?.maxLength ?? ''}
                onChange={(event) => patchValidation({ maxLength: event.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {(supportsRule(draft.type, 'min') || supportsRule(draft.type, 'max')) && (
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Sigma size={14} className="text-slate-400" /> Value range
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mf-label">Minimum</label>
              <Input
                type="number"
                value={draft.validation?.min ?? ''}
                onChange={(event) => patchValidation({ min: event.target.value })}
              />
            </div>
            <div>
              <label className="mf-label">Maximum</label>
              <Input
                type="number"
                value={draft.validation?.max ?? ''}
                onChange={(event) => patchValidation({ max: event.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {!strategy.supports?.validation?.length && !hasFormatRule && (
        <p className="rounded-lg bg-slate-50 px-3.5 py-3 text-xs text-slate-500">
          {strategy.label} fields have no additional validation rules beyond “required”.
        </p>
      )}
    </div>
  );
}

export default FieldValidationStep;
