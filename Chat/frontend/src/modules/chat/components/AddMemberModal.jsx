import { useMemo, useState } from 'react';
import { Modal } from '../../../shared/components/Modal.jsx';
import { Button } from '../../../shared/components/Button.jsx';
import { Avatar } from '../../../shared/components/Avatar.jsx';

export function AddMemberModal({
  open,
  onClose,
  candidates = [],
  existingIds = [],
  onAdd,
  loading,
}) {
  const [selected, setSelected] = useState([]);

  const eligible = useMemo(
    () => candidates.filter((c) => !existingIds.includes(c.id)),
    [candidates, existingIds]
  );

  function toggle(id) {
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );
  }

  async function handleAdd() {
    if (selected.length === 0) return;
    await onAdd(selected);
    setSelected([]);
    onClose?.();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add members"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAdd}
            disabled={loading || selected.length === 0}
          >
            {loading ? 'Adding...' : `Add ${selected.length || ''}`.trim()}
          </Button>
        </>
      }
    >
      <div className="max-h-72 overflow-y-auto">
        {eligible.length === 0 ? (
          <div className="py-6 text-center text-sm text-wa-muted">
            No more contacts to add.
          </div>
        ) : (
          eligible.map((u) => (
            <label
              key={u.id}
              className="flex cursor-pointer items-center gap-3 border-b border-wa-border px-1 py-2 last:border-0"
            >
              <input
                type="checkbox"
                checked={selected.includes(u.id)}
                onChange={() => toggle(u.id)}
              />
              <Avatar name={u.name} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-wa-dark">
                  {u.name}
                </div>
                <div className="text-xs text-wa-muted">+91 {u.mobile}</div>
              </div>
            </label>
          ))
        )}
      </div>
    </Modal>
  );
}
