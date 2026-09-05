// modules/status/hooks/useMyStatuses.js — my own active statuses + delete +
// live viewer-count bumps via socket (status:viewed on my rooms).
import { useCallback, useEffect, useState } from 'react';
import { statusApi } from '../services/status.api.js';
import { useSocketEvent } from '../../../core/hooks/useSocketEvent.js';
import { SOCKET_EVENTS } from '../../../core/socket/socket.constants.js';

export function useMyStatuses() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    statusApi
      .getMyStatuses()
      .then((res) => setStatuses(res.statuses))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Someone viewed one of my statuses → bump its count live.
  useSocketEvent(SOCKET_EVENTS.STATUS_VIEWED, ({ statusId }) => {
    setStatuses((prev) =>
      prev.map((s) => (s.id === statusId ? { ...s, viewersCount: s.viewersCount + 1 } : s))
    );
  });

  const remove = async (statusId) => {
    await statusApi.deleteStatus(statusId);
    setStatuses((prev) => prev.filter((s) => s.id !== statusId));
  };

  return { statuses, loading, remove, reload: load, isEmpty: !loading && statuses.length === 0 };
}
