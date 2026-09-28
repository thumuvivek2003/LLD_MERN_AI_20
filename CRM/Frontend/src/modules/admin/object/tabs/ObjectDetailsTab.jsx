import { useEffect, useState } from 'react';
import objectsApi from '../../../../core/api/objects.api.js';
import { toUpdateObjectPayload } from '../../../../shared/dto/object.dto.js';
import { useToast } from '../../../../core/context/ToastContext.jsx';
import { Input, Textarea } from '../../../../core/components/ui/Input.jsx';
import Select from '../../../../core/components/ui/Select.jsx';
import Button from '../../../../core/components/ui/Button.jsx';
import StatusPill from '../../../../core/components/ui/StatusPill.jsx';
import ObjectAppearance from '../../components/ObjectAppearance.jsx';
import ValidationMessage from '../../../../core/components/form/ValidationMessage.jsx';

/** Edit Object → Details. Label, description, icon/colour, primary display field. */
export function ObjectDetailsTab({ object, onSaved }) {
  const toast = useToast();
  const [draft, setDraft] = useState(object);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => setDraft(object), [object]);

  const patch = (changes) => setDraft((current) => ({ ...current, ...changes }));

  const save = async () => {
    if (!draft.label?.trim()) {
      setErrors({ label: 'Object label is required' });
      return;
    }
    setSaving(true);
    try {
      await objectsApi.update(object.objectId, toUpdateObjectPayload(draft));
      toast.success('Object updated');
      setErrors({});
      await onSaved?.();
    } catch (err) {
      if (err.isValidation) setErrors(err.toFieldErrors());
      toast.fromError(err, 'Could not save object');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      <div className="space-y-4">
        <div>
          <label className="mf-label">
            Object Label <span className="text-rose-500">*</span>
          </label>
          <Input
            value={draft.label ?? ''}
            invalid={Boolean(errors.label)}
            onChange={(event) => patch({ label: event.target.value })}
          />
          <ValidationMessage message={errors.label} />
        </div>

        <div>
          <label className="mf-label">Description</label>
          <Textarea
            rows={3}
            value={draft.description ?? ''}
            onChange={(event) => patch({ description: event.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mf-label">API Name</label>
            <Input value={draft.apiName ?? ''} disabled />
            <p className="mt-1.5 text-[11px] text-slate-400">Immutable once the object exists.</p>
          </div>
          <div>
            <label className="mf-label">Primary Display Field</label>
            <Select
              value={draft.primaryDisplayFieldId ?? ''}
              placeholder="Select field"
              onChange={(event) => patch({ primaryDisplayFieldId: event.target.value })}
              options={(object.fields || []).map((field) => ({
                value: field.fieldId,
                label: field.label,
              }))}
            />
            <p className="mt-1.5 text-[11px] text-slate-400">
              Used for record titles and lookup chips.
            </p>
          </div>
        </div>

        <div>
          <label className="mf-label">Status</label>
          <div className="flex items-center gap-2">
            <StatusPill kind="object" status={object.status} />
            <span className="text-xs text-slate-400">Version {object.version ?? 1}</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button variant="secondary" onClick={() => setDraft(object)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={save} loading={saving}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <ObjectAppearance
          icon={draft.icon}
          color={draft.color}
          onIconChange={(icon) => patch({ icon })}
          onColorChange={(color) => patch({ color })}
        />
      </div>
    </div>
  );
}

export default ObjectDetailsTab;
