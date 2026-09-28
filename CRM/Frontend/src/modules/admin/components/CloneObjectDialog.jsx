import { useEffect, useState } from 'react';
import objectsApi from '../../../core/api/objects.api.js';
import { toCloneObjectPayload } from '../../../shared/dto/object.dto.js';
import { toApiName } from '../../../core/utils/formatters.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import Modal from '../../../core/components/ui/Modal.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { Input } from '../../../core/components/ui/Input.jsx';
import { Toggle } from '../../../core/components/ui/Toggle.jsx';

/** `POST /objects/:oid/clone` — exposed as an action, not a route (chat.md guidance). */
export function CloneObjectDialog({ object, onClose, onCloned }) {
  const toast = useToast();
  const [label, setLabel] = useState('');
  const [apiName, setApiName] = useState('');
  const [includeRecords, setIncludeRecords] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!object) return;
    setLabel(`${object.label} Copy`);
    setApiName(toApiName(`${object.label} Copy`));
    setIncludeRecords(false);
  }, [object]);

  const submit = async () => {
    setSaving(true);
    try {
      const created = await objectsApi.clone(
        object.objectId,
        toCloneObjectPayload({ label, apiName, includeRecords }),
      );
      onCloned?.(created);
    } catch (err) {
      toast.fromError(err, 'Clone failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={Boolean(object)}
      onClose={onClose}
      title={`Clone ${object?.label ?? 'object'}`}
      subtitle="Creates a new draft object with the same field definitions"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={submit} loading={saving} disabled={!label.trim() || !apiName.trim()}>
            Clone object
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mf-label">New object label</label>
          <Input
            value={label}
            onChange={(event) => {
              setLabel(event.target.value);
              setApiName(toApiName(event.target.value));
            }}
          />
        </div>
        <div>
          <label className="mf-label">New API name</label>
          <Input value={apiName} onChange={(event) => setApiName(event.target.value)} />
        </div>
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
          <div>
            <p className="text-sm font-semibold text-slate-800">Copy records too</p>
            <p className="text-[11px] text-slate-500">Off by default — clones the schema only.</p>
          </div>
          <Toggle checked={includeRecords} onChange={setIncludeRecords} />
        </div>
      </div>
    </Modal>
  );
}

export default CloneObjectDialog;
