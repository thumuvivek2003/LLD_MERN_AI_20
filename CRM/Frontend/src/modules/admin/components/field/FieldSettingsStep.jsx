import { ArrowUpDown, Eye, Filter, Lock, Search, Star } from 'lucide-react';
import { FIELD_TYPE } from '../../../../shared/enums/field-type.enum.js';
import { getFieldType } from '../../../../core/fields/registry.js';
import { ToggleRow } from '../../../../core/components/ui/Toggle.jsx';
import { Input } from '../../../../core/components/ui/Input.jsx';
import PicklistOptionsEditor from './PicklistOptionsEditor.jsx';
import LookupBuilder from './LookupBuilder.jsx';

/** Step 2 of Add Field — behaviour toggles plus type-specific configuration. */
export function FieldSettingsStep({ draft, onChange, errors = {}, objectId }) {
  const patch = (changes) => onChange({ ...draft, ...changes });
  const supports = getFieldType(draft.type).supports || {};
  const isPicklist =
    draft.type === FIELD_TYPE.PICKLIST || draft.type === FIELD_TYPE.MULTI_PICKLIST;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 px-4">
        <ToggleRow
          icon={Star}
          title="Required"
          description="Records cannot be saved without a value"
          checked={draft.required}
          onChange={(required) => patch({ required })}
        />
        <ToggleRow
          icon={Search}
          title="Searchable"
          description="Include in the search index — enabling this triggers an index build"
          checked={draft.searchable}
          onChange={(searchable) => patch({ searchable })}
        />
        <ToggleRow
          icon={ArrowUpDown}
          title="Sortable"
          description="Allow list views to sort by this field"
          checked={draft.sortable}
          onChange={(sortable) => patch({ sortable })}
        />
        <ToggleRow
          icon={Filter}
          title="Filterable"
          description="Offer this field in the filter builder"
          checked={draft.filterable}
          onChange={(filterable) => patch({ filterable })}
        />
        {supports.unique && (
          <ToggleRow
            icon={Eye}
            title="Unique"
            description="Ensure no two records share the same value"
            checked={draft.unique}
            onChange={(unique) => patch({ unique })}
          />
        )}
        <ToggleRow
          icon={Lock}
          title="Read only"
          description="Render as text on every form; only the system can set it"
          checked={draft.readOnly}
          onChange={(readOnly) => patch({ readOnly })}
        />
      </div>

      {isPicklist && (
        <PicklistOptionsEditor
          options={draft.options}
          error={errors.options}
          onChange={(options) => patch({ options })}
        />
      )}

      {draft.type === FIELD_TYPE.LOOKUP && (
        <LookupBuilder
          lookup={draft.lookup}
          errors={errors}
          excludeObjectId={objectId}
          onChange={(lookup) => patch({ lookup })}
        />
      )}

      {!isPicklist && draft.type !== FIELD_TYPE.LOOKUP && (
        <div>
          <label className="mf-label" htmlFor="fieldsettingsstep-default-value">Default Value</label>
          <Input
            id="fieldsettingsstep-default-value"
            value={draft.defaultValue ?? ''}
            placeholder="Leave blank for no default"
            onChange={(event) => patch({ defaultValue: event.target.value })}
          />
        </div>
      )}
    </div>
  );
}

export default FieldSettingsStep;
