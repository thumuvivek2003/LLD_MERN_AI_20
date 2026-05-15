import { useEffect, useState } from 'react';
import { fetchDashboardSnapshot } from '../services/dashboard.service.js';
import { storeActions } from '../../elevator/store/elevator.store.js';
import { mapSnapshotDto } from '../../elevator/mapper/elevator.mapper.js';

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const dto = await fetchDashboardSnapshot();
        const snap = mapSnapshotDto(dto || {});
        if (!mounted) return;
        storeActions.setSnapshot({
          elevators: snap.elevators.length ? snap.elevators : undefined,
          requests: snap.requests,
          stats: snap.stats,
          simulation: snap.simulation,
        });
      } catch (e) {
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { loading, error };
}
