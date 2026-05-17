import { useState } from 'react';
import { Button } from '../../../shared/components/Button.jsx';

export function UserActionMenu({ user, onBlock, onUnblock, onView }) {
  const [busy, setBusy] = useState(false);

  async function handleBlock() {
    setBusy(true);
    try {
      await onBlock?.(user);
    } finally {
      setBusy(false);
    }
  }

  async function handleUnblock() {
    setBusy(true);
    try {
      await onUnblock?.(user);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <Button size="sm" variant="outline" onClick={() => onView?.(user)}>
        View
      </Button>
      {user.isBlocked ? (
        <Button
          size="sm"
          variant="primary"
          disabled={busy}
          onClick={handleUnblock}
        >
          Unblock
        </Button>
      ) : (
        <Button
          size="sm"
          variant="danger"
          disabled={busy}
          onClick={handleBlock}
        >
          Block
        </Button>
      )}
    </div>
  );
}
