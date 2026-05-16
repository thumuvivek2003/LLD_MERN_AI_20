import { useState } from 'react';
import { retryNotification } from '../services/adminNotification.service.js';

export function RetryNotificationButton({
  notificationId,
  status,
  onRetried,
  className = '',
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const canRetry = status === 'FAILED' || status === 'DEAD';
  if (!canRetry) {
    return (
      <button
        disabled
        title="Retry only allowed for FAILED or DEAD"
        className={`btn-ghost text-xs opacity-50 cursor-not-allowed ${className}`}
      >
        Retry
      </button>
    );
  }

  async function handle() {
    setBusy(true);
    setErr(null);
    try {
      await retryNotification(notificationId);
      onRetried?.();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      disabled={busy}
      onClick={handle}
      className={`btn-secondary text-xs ${className}`}
      title={err || 'Retry this notification'}
    >
      {busy ? 'Retrying…' : 'Retry'}
    </button>
  );
}
