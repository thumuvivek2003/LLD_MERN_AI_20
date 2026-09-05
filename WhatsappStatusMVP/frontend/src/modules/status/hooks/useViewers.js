// modules/status/hooks/useViewers.js — load viewers for one of my statuses.
import { useEffect, useState } from 'react';
import { statusApi } from '../services/status.api.js';
import { toViewerModel } from '../mappers/status.mapper.js';

export function useViewers(statusId) {
  const [viewers, setViewers] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!statusId) return;
    let alive = true;
    setLoading(true);
    statusApi
      .getViewers(statusId)
      .then((res) => {
        if (!alive) return;
        setViewers(res.viewers.map(toViewerModel));
        setCount(res.count);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [statusId]);

  return { viewers, count, loading };
}
