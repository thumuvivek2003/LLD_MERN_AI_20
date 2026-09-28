import { useState } from 'react';
import { viewsApi } from '../../../core/api/search.api.js';
import { toViewPayload } from '../../../shared/dto/view.dto.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import Modal from '../../../core/components/ui/Modal.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { Input } from '../../../core/components/ui/Input.jsx';
import { Toggle } from '../../../core/components/ui/Toggle.jsx';

/**
 * Persists the current query as a saved view. The body is produced by the same
 * `SearchQueryBuilder` that runs the search, so views round-trip exactly.
 */
export function SaveViewDialog({ open, onClose, builder, onSaved }) {
  const toast = useToast();
  const [name, setName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await viewsApi.create(toViewPayload({ name, builder, isDefault }));
      setName('');
      setIsDefault(false);
      onSaved?.();
    } catch (err) {
      toast.fromError(err, 'Could not save view');
    } finally {
      setSaving(false);
    }
  };

  const filterCount = builder ? builder.usableFilters().length : 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Save View"
      subtitle="Keep this filter set for quick access later"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={submit} loading={saving} disabled={!name.trim()}>
            Save View
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mf-label" htmlFor="saveviewdialog-view-name">View name</label>
          <Input
            id="saveviewdialog-view-name"
            autoFocus
            value={name}
            placeholder="High Value Customers"
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
          <div>
            <p className="text-sm font-semibold text-slate-800">Make default</p>
            <p className="text-[11px] text-slate-500">Open this view first for this object.</p>
          </div>
          <Toggle checked={isDefault} onChange={setIsDefault} />
        </div>
        <p className="text-[11px] text-slate-400">
          {filterCount} filter{filterCount === 1 ? '' : 's'} will be stored with this view.
        </p>
      </div>
    </Modal>
  );
}

export default SaveViewDialog;
