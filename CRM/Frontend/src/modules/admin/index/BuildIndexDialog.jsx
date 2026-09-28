import { useEffect, useState } from 'react';
import indexesApi from '../../../core/api/indexes.api.js';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { fieldIndexType } from '../../../core/fields/registry.js';
import { INDEX_TYPE, INDEX_TYPE_LABEL } from '../../../shared/enums/index-type.enum.js';
import Modal from '../../../core/components/ui/Modal.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import Badge from '../../../core/components/ui/Badge.jsx';

/** `POST /indexes` — build a new index for one object field. */
export function BuildIndexDialog({ open, onClose, onBuilt, defaultObjectId }) {
  const toast = useToast();
  const { objects, getObject } = useMetadata();
  const [objectId, setObjectId] = useState(defaultObjectId || '');
  const [fieldId, setFieldId] = useState('');
  const [type, setType] = useState('');
  const [fields, setFields] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setObjectId(defaultObjectId || objects[0]?.objectId || '');
  }, [open, defaultObjectId, objects]);

  useEffect(() => {
    let alive = true;
    if (!objectId) {
      setFields([]);
      return undefined;
    }
    getObject(objectId)
      .then((definition) => alive && setFields(definition?.fields || []))
      .catch(() => alive && setFields([]));
    return () => {
      alive = false;
    };
  }, [objectId, getObject]);

  useEffect(() => {
    setFieldId('');
    setType('');
  }, [objectId]);

  const selectedField = fields.find((field) => field.fieldId === fieldId);
  const suggested = selectedField ? fieldIndexType(selectedField.type) : null;

  const submit = async () => {
    setSaving(true);
    try {
      await indexesApi.create({ objectId, fieldId, ...(type ? { type } : {}) });
      toast.success('Index build queued', `${selectedField?.label} on ${objectId}`);
      onBuilt?.();
    } catch (err) {
      toast.fromError(err, 'Could not build index');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Build Index"
      subtitle="Create a search index for a field"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={submit} loading={saving} disabled={!objectId || !fieldId}>
            Build Index
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mf-label" htmlFor="buildindexdialog-object">Object</label>
          <Select
            id="buildindexdialog-object"
            value={objectId}
            placeholder="Select object"
            onChange={(event) => setObjectId(event.target.value)}
            options={objects.map((object) => ({ value: object.objectId, label: object.label }))}
          />
        </div>
        <div>
          <label className="mf-label" htmlFor="buildindexdialog-field">Field</label>
          <Select
            id="buildindexdialog-field"
            value={fieldId}
            placeholder={objectId ? 'Select field' : 'Choose an object first'}
            disabled={!objectId}
            onChange={(event) => setFieldId(event.target.value)}
            options={fields.map((field) => ({ value: field.fieldId, label: field.label }))}
          />
        </div>
        <div>
          <label className="mf-label" htmlFor="buildindexdialog-index-type">Index Type</label>
          <Select
            id="buildindexdialog-index-type"
            value={type}
            placeholder={
              suggested ? `Auto — ${INDEX_TYPE_LABEL[suggested]}` : 'Auto (chosen by field type)'
            }
            onChange={(event) => setType(event.target.value)}
            options={Object.values(INDEX_TYPE)
              .filter((value) => value !== INDEX_TYPE.GEO)
              .map((value) => ({ value, label: INDEX_TYPE_LABEL[value] }))}
          />
          {suggested && (
            <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-400">
              Recommended for this field type: <Badge tone="sky">{INDEX_TYPE_LABEL[suggested]}</Badge>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default BuildIndexDialog;
