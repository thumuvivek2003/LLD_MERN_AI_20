import { useEffect, useState } from 'react';
import { Link2 } from 'lucide-react';
import { useMetadata } from '../../../../core/context/MetadataContext.jsx';
import { LOOKUP_ON_DELETE } from '../../../../shared/enums/field-type.enum.js';
import Select from '../../../../core/components/ui/Select.jsx';
import ValidationMessage from '../../../../core/components/form/ValidationMessage.jsx';

/**
 * Admin screen 11 — Lookup field builder.
 * Related object + display field + delete behaviour; rendered inside the Add/Edit
 * Field wizards whenever the chosen type is LOOKUP.
 */
export function LookupBuilder({ lookup, onChange, errors = {}, excludeObjectId }) {
  const { objects, getObject } = useMetadata();
  const [targetFields, setTargetFields] = useState([]);

  useEffect(() => {
    let alive = true;
    if (!lookup?.objectId) {
      setTargetFields([]);
      return undefined;
    }
    getObject(lookup.objectId)
      .then((definition) => alive && setTargetFields(definition?.fields || []))
      .catch(() => alive && setTargetFields([]));
    return () => {
      alive = false;
    };
  }, [lookup?.objectId, getObject]);

  const patch = (changes) => onChange({ ...lookup, ...changes });

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Link2 size={19} />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Relationship</p>
          <p className="text-[11px] text-slate-500">Create a relationship with another object</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mf-label" htmlFor="lookupbuilder-related-object">
            Related Object <span className="text-rose-500">*</span>
          </label>
          <Select
            id="lookupbuilder-related-object"
            value={lookup?.objectId ?? ''}
            invalid={Boolean(errors.lookupObject)}
            placeholder="Select object"
            onChange={(event) => patch({ objectId: event.target.value, displayFieldId: '' })}
            options={objects
              .filter((object) => object.objectId !== excludeObjectId)
              .map((object) => ({ value: object.objectId, label: object.label }))}
          />
          <ValidationMessage message={errors.lookupObject} />
        </div>

        <div>
          <label className="mf-label" htmlFor="lookupbuilder-display-field">
            Display Field <span className="text-rose-500">*</span>
          </label>
          <Select
            id="lookupbuilder-display-field"
            value={lookup?.displayFieldId ?? ''}
            invalid={Boolean(errors.lookupDisplay)}
            placeholder={lookup?.objectId ? 'Select field' : 'Choose an object first'}
            disabled={!lookup?.objectId}
            onChange={(event) => patch({ displayFieldId: event.target.value })}
            options={targetFields.map((field) => ({ value: field.fieldId, label: field.label }))}
          />
          <ValidationMessage message={errors.lookupDisplay} />
        </div>

        <div className="sm:col-span-2">
          <label className="mf-label" htmlFor="lookupbuilder-on-delete">On Delete</label>
          <Select
            id="lookupbuilder-on-delete"
            value={lookup?.onDelete ?? LOOKUP_ON_DELETE.RESTRICT}
            onChange={(event) => patch({ onDelete: event.target.value })}
            options={[
              { value: LOOKUP_ON_DELETE.RESTRICT, label: 'RESTRICT — block deleting the parent' },
              { value: LOOKUP_ON_DELETE.CASCADE, label: 'CASCADE — delete children too' },
              { value: LOOKUP_ON_DELETE.SET_NULL, label: 'SET_NULL — clear the reference' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default LookupBuilder;
